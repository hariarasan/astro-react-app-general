/**
 * Fixed South Indian chart layout: each zodiac sign always occupies the
 * same cell in a 4x4 grid, regardless of the lagna. sign_index follows
 * the API convention: Aries=0 ... Pisces=11.
 *
 * Grid (row, col), 0-indexed, 4x4:
 *   Pisces   Aries    Taurus   Gemini
 *   Aquarius  --        --     Cancer
 *   Capricorn --        --     Leo
 *   Sagittarius Scorpio Libra  Virgo
 */
export const SIGN_GRID_POSITION: [number, number][] = [
  [0, 1], // 0 Aries
  [0, 2], // 1 Taurus
  [0, 3], // 2 Gemini
  [1, 3], // 3 Cancer
  [2, 3], // 4 Leo
  [3, 3], // 5 Virgo
  [3, 2], // 6 Libra
  [3, 1], // 7 Scorpio
  [3, 0], // 8 Sagittarius
  [2, 0], // 9 Capricorn
  [1, 0], // 10 Aquarius
  [0, 0], // 11 Pisces
];

/**
 * Sign/planet name -> short label shown inside a chart cell. Keyed by
 * whatever string the backend actually returns for the current
 * Accept-Language (English or Tamil - see astro-fast-api's
 * app/astro/i18n.py SIGN_TA/PLANET_TA for the exact Tamil source
 * strings), so the same lookup works for either language without this
 * component needing to know which one is active. The Tamil entries are
 * the standard short forms used in printed Tamil rasi charts.
 */
export const SIGN_ABBREVIATIONS: Record<string, string> = {
  // English
  Aries: 'Ari',
  Taurus: 'Tau',
  Gemini: 'Gem',
  Cancer: 'Can',
  Leo: 'Leo',
  Virgo: 'Vir',
  Libra: 'Lib',
  Scorpio: 'Sco',
  Sagittarius: 'Sag',
  Capricorn: 'Cap',
  Aquarius: 'Aqu',
  Pisces: 'Pis',
  // Tamil
  'மேஷம்': 'மே',
  'ரிஷபம்': 'ரி',
  'மிதுனம்': 'மி',
  'கடகம்': 'கட',
  'சிம்மம்': 'சிம்',
  'கன்னி': 'கன்',
  'துலாம்': 'து',
  'விருச்சிகம்': 'விரு',
  'தனுசு': 'தனு',
  'மகரம்': 'மக',
  'கும்பம்': 'கும்',
  'மீனம்': 'மீ',
};

export const PLANET_ABBREVIATIONS: Record<string, string> = {
  // English
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  // Tamil
  'சூரியன்': 'சூ',
  'சந்திரன்': 'சந்',
  'செவ்வாய்': 'செ',
  'புதன்': 'பு',
  'குரு': 'கு',
  'சுக்கிரன்': 'சு',
  'சனி': 'சனி',
  'ராகு': 'ரா',
  'கேது': 'கே',
};

export const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
