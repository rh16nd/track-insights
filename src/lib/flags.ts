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
  ALB: "al",
  ALG: "dz",
  AND: "ad",
  ARG: "ar",
  ARM: "am",
  AUS: "au",
  AUT: "at",
  AZE: "az",
  BAH: "bs",
  BAR: "bb", // Barbados
  BDI: "bi",
  BEL: "be",
  BEN: "bj",
  BER: "bm",
  BIH: "ba", // Bosnia and Herzegovina
  BLR: "by",
  BOT: "bw",
  BRA: "br",
  BRN: "bh", // Bahrain (the Bahamas is BAH)
  BUL: "bg",
  BUR: "bf", // Burkina Faso (Burundi is BDI)
  CAN: "ca",
  CAY: "ky",
  CHI: "cl", // Chile (China is CHN)
  CHN: "cn",
  CIV: "ci", // Côte d'Ivoire
  CMR: "cm",
  COL: "co",
  CPV: "cv", // Cabo Verde
  CRC: "cr", // Costa Rica
  CRO: "hr",
  CUB: "cu",
  CYP: "cy",
  CZE: "cz",
  DEN: "dk", // Denmark
  DJI: "dj",
  DMA: "dm",
  DOM: "do",
  ECU: "ec",
  EGY: "eg",
  ERI: "er",
  ESA: "sv", // El Salvador
  ESP: "es",
  EST: "ee",
  ETH: "et",
  FIJ: "fj", // Fiji
  FIN: "fi",
  FRA: "fr",
  GAB: "ga",
  GAM: "gm",
  GBR: "gb",
  GEO: "ge", // Georgia (Germany is GER)
  GER: "de",
  GHA: "gh",
  GRE: "gr",
  GRN: "gd",
  GUA: "gt", // Guatemala
  GUI: "gn", // Guinea (Guinea-Bissau is GBS)
  GUY: "gy",
  HAI: "ht", // Haiti
  HUN: "hu",
  IND: "in",
  IRI: "ir", // Iran
  IRL: "ie",
  ISL: "is", // Iceland (Israel is ISR)
  ISR: "il", // Israel
  ISV: "vi", // US Virgin Islands (the British ones are IVB)
  ITA: "it",
  IVB: "vg", // British Virgin Islands
  JAM: "jm",
  JPN: "jp",
  KAZ: "kz",
  KEN: "ke",
  KOR: "kr",
  KSA: "sa", // Saudi Arabia
  LAT: "lv",
  LBN: "lb", // Lebanon
  LBR: "lr", // Liberia
  LCA: "lc",
  LES: "ls", // Lesotho
  LTU: "lt",
  LUX: "lu",
  MAR: "ma",
  MAS: "my", // Malaysia
  MDA: "md",
  MEX: "mx",
  MNE: "me",
  MOZ: "mz",
  MRI: "mu", // Mauritius (Morocco is MAR)
  NAM: "na", // Namibia
  NED: "nl",
  NGR: "ng",
  NIG: "ne", // Niger -- NOT Nigeria, which is NGR
  NOR: "no",
  NZL: "nz",
  OMA: "om", // Oman
  PAK: "pk",
  PAN: "pa",
  PAR: "py", // Paraguay
  PER: "pe",
  PHI: "ph",
  POL: "pl",
  POR: "pt",
  PRK: "kp", // DPR Korea (the South is KOR)
  PUR: "pr",
  QAT: "qa",
  ROU: "ro",
  RSA: "za",
  RUS: "ru",
  RWA: "rw",
  SAM: "ws", // Samoa
  SEN: "sn",
  SLO: "si", // Slovenia (Slovakia is SVK)
  SRB: "rs",
  SRI: "lk",
  SSD: "ss", // South Sudan
  SUI: "ch",
  SVK: "sk",
  SWE: "se",
  TAN: "tz", // Tanzania
  TGA: "to", // Tonga
  THA: "th",
  TPE: "tw", // Chinese Taipei
  TTO: "tt",
  TUN: "tn",
  TUR: "tr",
  UAE: "ae",
  UGA: "ug",
  UKR: "ua",
  URU: "uy", // Uruguay
  USA: "us",
  UZB: "uz",
  VEN: "ve",
  VIN: "vc", // Saint Vincent and the Grenadines
  ZAM: "zm",
  ZIM: "zw",
};
