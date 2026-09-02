/** World Athletics reports nationality as a 3-letter IOC code, which is NOT
 * the same as ISO 3166-1 alpha-2 — the codes diverge in ways that matter here
 * (IOC `BRN` is Bahrain, not the Bahamas; `SLO` is Slovenia, not Slovakia;
 * `IVB` is the British Virgin Islands). The flag SVGs in `public/flags/` are
 * named by ISO alpha-2 (vendored from the MIT `flag-icons` set), so this map
 * is the bridge, hand-verified for every nation that appears in the data.
 *
 * A code with no entry here is not a bug — it just renders as the bare 3-letter
 * code with no flag (see NatFlag), which is the correct graceful fallback for a
 * nation we don't have a verified flag for. Better no flag than a wrong one:
 * an incorrect flag would be exactly the kind of fabricated detail this project
 * refuses. Keep this list accurate rather than complete. */
export const IOC_TO_ISO2: Record<string, string> = {
  ALG: "dz",
  AUS: "au",
  BAH: "bs",
  BDI: "bi",
  BEL: "be",
  BLR: "by",
  BOT: "bw",
  BRA: "br",
  BRN: "bh", // Bahrain (the Bahamas is BAH)
  BUL: "bg",
  CAN: "ca",
  CAY: "ky",
  CHN: "cn",
  CMR: "cm",
  COL: "co",
  CRO: "hr",
  CUB: "cu",
  CZE: "cz",
  DMA: "dm",
  DOM: "do",
  ESP: "es",
  ETH: "et",
  FRA: "fr",
  GAM: "gm",
  GBR: "gb",
  GER: "de",
  GRE: "gr",
  GRN: "gd",
  IND: "in",
  IRL: "ie",
  ITA: "it",
  IVB: "vg", // British Virgin Islands
  JAM: "jm",
  JPN: "jp",
  KAZ: "kz",
  KEN: "ke",
  LAT: "lv",
  LCA: "lc",
  LTU: "lt",
  LUX: "lu",
  MAR: "ma",
  MEX: "mx",
  MNE: "me",
  NED: "nl",
  NGR: "ng",
  NOR: "no",
  NZL: "nz",
  PAN: "pa",
  POL: "pl",
  POR: "pt",
  PUR: "pr",
  QAT: "qa",
  ROU: "ro",
  RSA: "za",
  RUS: "ru",
  SEN: "sn",
  SLO: "si", // Slovenia (Slovakia is SVK)
  SRB: "rs",
  SRI: "lk",
  SUI: "ch",
  SVK: "sk",
  SWE: "se",
  TTO: "tt",
  TUN: "tn",
  UGA: "ug",
  UKR: "ua",
  USA: "us",
  VEN: "ve",
  ZAM: "zm",
  ZIM: "zw",
};
