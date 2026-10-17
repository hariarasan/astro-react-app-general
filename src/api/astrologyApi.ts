import { apiClient } from './client';
import type {
  BirthDetailsRequest,
  ChartResponse,
  DashaResponse,
  MahapurushaYogaResponse,
  PlanetaryAnalysisRequestBody,
  PlanetaryAnalysisResponse,
} from '../types/astrology';
import type { AppLanguage } from '../types/language';

export function fetchRasiChart(
  body: BirthDetailsRequest,
  language: AppLanguage,
): Promise<ChartResponse> {
  return apiClient.request<ChartResponse>('/api/v1/charts/rasi', body, language);
}

export function fetchNavamsaChart(
  body: BirthDetailsRequest,
  language: AppLanguage,
): Promise<ChartResponse> {
  return apiClient.request<ChartResponse>('/api/v1/charts/navamsa', body, language);
}

export function fetchAnalysis(
  body: PlanetaryAnalysisRequestBody,
  language: AppLanguage,
): Promise<PlanetaryAnalysisResponse> {
  return apiClient.request<PlanetaryAnalysisResponse>('/api/v1/charts/analysis', body, language);
}

export function fetchMahapurushaYogas(
  body: BirthDetailsRequest,
  language: AppLanguage,
): Promise<MahapurushaYogaResponse> {
  return apiClient.request<MahapurushaYogaResponse>(
    '/api/v1/charts/mahapurusha-yogas',
    body,
    language,
  );
}

export function fetchDasha(
  body: BirthDetailsRequest,
  language: AppLanguage,
): Promise<DashaResponse> {
  return apiClient.request<DashaResponse>('/api/v1/charts/dasha', body, language);
}
