import { PAGE_PHOTO_CREDITS, type PagePhotoKey } from "./page-photo-credits";

/** Every page opens on a short photo header, as the landing opens on its hero:
 * an athletics scene chosen for the page, under the landing's warm dark wash,
 * with the page title on it (the user, 2026-09-21).
 *
 * They were asked for as a trial ("maybe try it, and then we'll see"), so this
 * one switch turns them off everywhere. Off, every header falls back to the
 * plain dark ground with a soft gold glow, and nothing else changes: no page
 * depends on its photo for anything but looks. */
export const PHOTO_HEADERS = true;

export type { PagePhotoKey };

export type PagePhoto = {
  small: string;
  large: string;
  author: string;
  license: string;
  source: string;
  /** CSS object-position, so a phone's tall crop keeps the subject. */
  focus: string;
};

/** The photo for a page, or null when photo headers are off. The files and
 * their credits come from scripts/page-photos.py. */
export function pagePhoto(key: PagePhotoKey | null | undefined): PagePhoto | null {
  if (!PHOTO_HEADERS || !key) return null;
  const credit = PAGE_PHOTO_CREDITS[key];
  return {
    small: `/photos/${key}-1200.webp`,
    large: `/photos/${key}-2400.webp`,
    ...credit,
  };
}
