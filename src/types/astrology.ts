/**
 * TypeScript mirrors of the astro-fast-api Pydantic schemas
 * (app/schemas.py). Keep these in sync with the backend.
 */

export interface BirthDetailsRequest {
  first_name: string;
  last_name: string;
  date_of_birth: string; // YYYY-MM-DD
  time_of_birth: string; // HH:mm:ss (24h, local clock time at birth place)
  latitude: number;
  longitude: number;
  timezone_offset_hours: number;
  place_name?: string | null;
}

export interface PlanetaryAnalysisRequestBody extends BirthDetailsRequest {
  sandhi_threshold_degrees?: number;
}

export interface AyanamsaInfo {
  name: string;
  degrees: number;
}

export interface LagnaInfo {
  sign: string;
  sign_index: number;
  degree_in_sign: number;
  longitude: number;
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  sign: string;
  sign_index: number;
  degree_in_sign: number;
  house: number;
  retrograde: boolean;
  nakshatra?: string | null;
  nakshatra_pada?: number | null;
}

export interface HouseInfo {
  house_number: number;
  sign: string;
  sign_index: number;
  planets: string[];
}

export type ChartType = 'rasi' | 'navamsa';

export interface ChartResponse {
  first_name: string;
  last_name: string;
  chart_type: ChartType;
  birth_details: BirthDetailsRequest;
  ayanamsa: AyanamsaInfo;
  lagna: LagnaInfo;
  planets: PlanetPosition[];
  houses: HouseInfo[];
}

// --- Planetary analysis -----------------------------------------------

export interface PlanetCondition {
  name: string;
  sign: string;
  house: number;
  degree_in_sign: number;
  vakram_retrograde: boolean;
  vilimbu_sandhi: boolean;
  atchi_own_sign: boolean;
  ucham_exalted: boolean;
  neecham_debilitated: boolean;
  exaltation_sign: string;
  debilitation_sign: string;
  exact_exaltation_degree?: number | null;
}

export interface ParivartanaYoga {
  planet_a: string;
  sign_a: string;
  planet_b: string;
  sign_b: string;
}

export interface NodeTrineOccupants {
  node: 'Rahu' | 'Ketu';
  node_sign: string;
  house_1: string[];
  house_5: string[];
  house_9: string[];
}

export interface SeventhLordInfo {
  lagna_sign: string;
  seventh_house_sign: string;
  lord: string;
}

export interface PlanetaryAnalysisResponse {
  first_name: string;
  last_name: string;
  birth_details: BirthDetailsRequest;
  sandhi_threshold_degrees: number;
  lagna: LagnaInfo;
  planets: PlanetCondition[];
  parivartana_yogas: ParivartanaYoga[];
  rahu_ketu_trines: NodeTrineOccupants[];
  seventh_lord: SeventhLordInfo;
}

// --- Vimshottari Dasha / Bhukti -----------------------------------------

export interface MoonNakshatraInfo {
  longitude: number;
  sign: string;
  sign_index: number;
  degree_in_sign: number;
  nakshatra: string;
  nakshatra_lord: string;
  nakshatra_pada: number;
}

export interface BhuktiPeriod {
  lord: string;
  start_date: string;
  end_date: string;
  duration_years: number;
  is_current: boolean;
}

export interface MahadashaPeriod {
  lord: string;
  start_date: string;
  end_date: string;
  duration_years: number;
  is_current: boolean;
  bhuktis: BhuktiPeriod[];
}

export interface CurrentDashaInfo {
  as_of_date: string;
  mahadasha: BhuktiPeriod;
  bhukti: BhuktiPeriod;
}

export interface DashaResponse {
  first_name: string;
  last_name: string;
  birth_details: BirthDetailsRequest;
  moon: MoonNakshatraInfo;
  dasha_system: string;
  days_per_year_convention: number;
  mahadashas: MahadashaPeriod[];
  current: CurrentDashaInfo;
}

// --- Pancha Mahapurusha Yogas ---------------------------------------------

export interface MahapurushaCandidate {
  planet: string;
  yoga: string;
  sign: string;
  house: number;
  in_kendra: boolean;
  own_sign: boolean;
  exalted: boolean;
  yoga_present: boolean;
  reason?: string | null;
}

export interface MahapurushaYogaResponse {
  first_name: string;
  last_name: string;
  birth_details: BirthDetailsRequest;
  lagna: LagnaInfo;
  candidates: MahapurushaCandidate[];
  yogas_present: MahapurushaCandidate[];
  has_any_yoga: boolean;
}

// --- Aggregate bundle used by the app ------------------------------------

export interface AstrologyBundle {
  rasi: ChartResponse;
  navamsa: ChartResponse;
  analysis: PlanetaryAnalysisResponse;
  mahapurusha: MahapurushaYogaResponse;
  dasha: DashaResponse;
}
