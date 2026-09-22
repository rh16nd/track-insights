// Written by scripts/page-photos.py. Do not edit by hand: change the
// PHOTOS table there and run it again.

export const PAGE_PHOTO_CREDITS = {
  dashboard: {
    author: "Steven Lelham",
    license: "Unsplash",
    source: "https://unsplash.com/photos/group-of-people-running-on-stadium-atSaEOeE8Nk",
    focus: "60% 50%",
  },
  track: {
    author: "Daieuxetdailleurs",
    license: "CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Athletics_at_the_2024_Summer_Olympics_%E2%80%93_Men%27s_4_%C3%97_100_metres_relay_final_-_08.jpg",
    focus: "50% 50%",
  },
  field: {
    author: "Bence Boros",
    license: "Unsplash",
    source: "https://unsplash.com/photos/top-view-of-stadium-m1cBsfdWZf8",
    focus: "55% 50%",
  },
  stats: {
    author: "Daieuxetdailleurs",
    license: "CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Athletics_at_the_2024_Summer_Olympics_Paris_-_Women%27s_3000mn_Steeplechase,_Finale_-_04.jpg",
    focus: "50% 45%",
  },
  schedule: {
    author: "CHUTTERSNAP",
    license: "Unsplash",
    source: "https://unsplash.com/photos/aerial-photography-of-sports-field-HBfOTPDz0pU",
    focus: "50% 50%",
  },
  qualification: {
    author: "Daieuxetdailleurs",
    license: "CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Athletics_at_the_2024_Summer_Olympics_%E2%80%93_Women%27s_100_metres_hurdles_semi-final_1_-_02.jpg",
    focus: "50% 50%",
  },
  results: {
    author: "Daieuxetdailleurs",
    license: "CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Athletics_at_the_2024_Summer_Olympics_%E2%80%93_Men%27s_400_m_hurdles_final_-_01.jpg",
    focus: "50% 50%",
  },
  how: {
    author: "Patrick Federi",
    license: "Unsplash",
    source: "https://unsplash.com/photos/aerial-view-of-green-and-brown-stadium-gzQJAWr8Vwk",
    focus: "50% 50%",
  },
  start: {
    author: "Kolleen Gladden",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Starting_line_(Unsplash).jpg",
    focus: "60% 50%",
  },
  nagoya: {
    author: "Kanko3131",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Mizuho_athletic_stadium130824-2.jpg",
    focus: "50% 55%",
  },
} as const;

export type PagePhotoKey = keyof typeof PAGE_PHOTO_CREDITS;
