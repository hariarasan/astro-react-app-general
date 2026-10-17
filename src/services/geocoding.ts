import type { CitySuggestion } from '../types/location';

/**
 * Open-Meteo Geocoding API - free, no API key required.
 * https://open-meteo.com/en/docs/geocoding-api
 */
const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone: string;
}

interface OpenMeteoResponse {
  results?: OpenMeteoResult[];
}

export async function searchCities(query: string): Promise<CitySuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_ENDPOINT}?name=${encodeURIComponent(
    trimmed,
  )}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Location lookup failed (${response.status})`);
  }

  const data: OpenMeteoResponse = await response.json();
  if (!data.results) {
    return [];
  }

  return data.results.map(result => ({
    id: result.id,
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    countryCode: result.country_code,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  }));
}

export function formatCityLabel(city: CitySuggestion): string {
  const parts = [city.name, city.admin1, city.country].filter(Boolean);
  return parts.join(', ');
}
