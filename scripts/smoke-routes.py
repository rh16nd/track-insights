r"""Open the site's main pages in a real browser, in English and in French, and
report every one that does not load.

Added 2026-09-15. The hammer's event page failed to load and nobody noticed
until a reader clicked it. A page that shows only its error panel still
returns 200, so this reads what the browser shows, not the status code.

A page fails when, once loading has finished, it shows the error panel or the
not-found page, has no heading, is in the wrong language, or logged a console
error. Loading has finished when no skeleton is left (aria-busy="true", from
PanelSkeleton in src/components/dl/shell.tsx) and the text has stopped
changing. React Query retries a failed request three times first, so a broken
page takes several seconds to show its error, and a check that reads the page
any sooner passes it.

Run with the predictor's venv, where Selenium lives, against a running site:
    C:\Users\rayen\athletics-predictor\venv\Scripts\python.exe scripts/smoke-routes.py [base URL]
The base defaults to the dev server, http://localhost:8080, which reads the
local API, so start that too. Pass https://www.podiumcall.cc to check the live
site. Exits 1 when any page fails.
"""
import json
import os
import re
import sys
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
STORAGE_KEY = "podiumcall:lang"  # src/lib/i18n.tsx
LANGS = ("en", "fr")

# One page of each kind. The men's hammer event page is here because it is the
# one that broke. Alison DOS SANTOS is on the world toplist, so every build has
# his page.
ROUTES = [
    "/",
    "/dashboard",
    "/track",
    "/field?disc=men_HT",
    "/discipline/men_400h",
    "/discipline/men_HT",
    "/country/HUN",
    "/athlete/men_400h/Alison%20DOS%20SANTOS",
    "/championship",
    "/results",
]
# The strings that mean a page did not load, read from the locale files.
FAILURE_KEYS = ("error.couldNotLoad", "notFound.title")

TIMEOUT = 45.0
SETTLE = 1.5
# Vercel serves its analytics script only on Vercel, so anywhere else it 404s.
IGNORED_CONSOLE = ("/_vercel/",)


def locale_string(lang, key):
    """One string from the site's locale file, so a copy change can't blind the check."""
    with open(os.path.join(ROOT, "src", "lib", "locales", f"{lang}.ts"), encoding="utf-8") as f:
        text = f.read()
    found = re.search(r'"%s":\s*"((?:[^"\\]|\\.)*)"' % re.escape(key), text)
    if not found:
        sys.exit(f"{key} is not in src/lib/locales/{lang}.ts")
    return json.loads(f'"{found.group(1)}"')


def start_browser():
    """Headless Chrome, started the way src/injury_checker.py starts it."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,900")
    options.add_argument("--log-level=3")
    options.set_capability("goog:loggingPrefs", {"browser": "SEVERE"})
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


def wait_until_loaded(browser):
    """(the page's text, whether it timed out): the text once no skeleton is
    left and it has held still for SETTLE seconds, or whatever is there at
    TIMEOUT."""
    deadline, last, since = time.monotonic() + TIMEOUT, None, time.monotonic()
    while time.monotonic() < deadline:
        busy, text = browser.execute_script(
            "return [document.querySelectorAll('[aria-busy=\"true\"]').length,"
            " document.body ? document.body.innerText : ''];"
        )
        if text != last:
            last, since = text, time.monotonic()
        elif not busy and time.monotonic() - since >= SETTLE:
            return last, False
        time.sleep(0.25)
    return last or "", True


def check(browser, base, route, lang, strings):
    """(the page's heading, [what is wrong with it])."""
    browser.get_log("browser")  # drop what the previous page logged
    browser.get(base + route)
    text, timed_out = wait_until_loaded(browser)
    problems = [f"still loading after {TIMEOUT:.0f}s"] if timed_out else []
    problems += [f'shows "{s}"' for s in strings[lang] if s in text]
    heading = browser.execute_script(
        "const h = document.querySelector('h1'); return h ? h.innerText.trim() : '';"
    )
    if not heading:
        problems.append("no heading")
    page_lang = browser.execute_script("return document.documentElement.lang;")
    if page_lang != lang:
        problems.append(f"page language is {page_lang!r}")
    problems += [f"console: {e['message'][:160]}" for e in browser.get_log("browser")
                 if not any(s in e["message"] for s in IGNORED_CONSOLE)]
    return heading, problems


def main(argv=None):
    # The French headings have accents, and a redirected Windows console writes cp1252.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    argv = sys.argv[1:] if argv is None else argv
    base = (argv[0] if argv else "http://localhost:8080").rstrip("/")
    strings = {lang: [locale_string(lang, key) for key in FAILURE_KEYS] for lang in LANGS}
    browser = start_browser()
    failed = 0
    try:
        for lang in LANGS:
            browser.get(base + "/")
            browser.execute_script("localStorage.setItem(arguments[0], arguments[1]);", STORAGE_KEY, lang)
            for route in ROUTES:
                heading, problems = check(browser, base, route, lang, strings)
                failed += bool(problems)
                print(f"  {'FAIL' if problems else 'ok  '} {lang} {route:<42} {' '.join(heading.split())[:48]}")
                for problem in problems:
                    print(f"         {problem}")
    finally:
        browser.quit()
    total = len(LANGS) * len(ROUTES)
    print(f"{total - failed} of {total} pages loaded" + (f", {failed} failed" if failed else ""))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
