// Written by scripts/page-photos.py. Do not edit by hand: change the
// PHOTOS table there and run it again.

export const PAGE_PHOTO_CREDITS = {
  dashboard: {
    author: "cdephotos",
    license: "CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Athletics_at_the_2012_Summer_Olympics_(7925560204).jpg",
    focus: "50% 45%",
  },
  track: {
    author: "Marie-Lan Nguyen",
    license: "CC BY 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:French_Athletics_Championships_2013_t113118.jpg",
    focus: "55% 60%",
  },
  start: {
    author: "Kolleen Gladden",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Starting_line_(Unsplash).jpg",
    focus: "60% 50%",
  },
  results: {
    author: "Harry Pot / Anefo",
    license: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Atletiek_Nederland_tegen_Duitsland,_finish_100_m_heren,_Bestanddeelnr_907-2891.jpg",
    focus: "50% 55%",
  },
  blocks: {
    author: "Jamain",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Starting_block_J1.jpg",
    focus: "50% 50%",
  },
  nagoya: {
    author: "Kanko3131",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Mizuho_athletic_stadium130824-2.jpg",
    focus: "50% 55%",
  },
} as const;

export type PagePhotoKey = keyof typeof PAGE_PHOTO_CREDITS;
