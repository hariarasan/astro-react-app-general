import Config from 'react-native-config';

import type { AppLanguage } from '../types/language';

/**
 * API base URL, read from the .env file at build time (see
 * react-native-config) - see .env for the currently configured value
 * (deployed backend vs. local testing). The fallback below only kicks in
 * if .env is missing/misconfigured, and matches http://10.0.2.2:8000 -
 * the special alias the Android emulator uses to reach the host
 * machine's "localhost" - as the safest local-dev default.
 */
export const API_BASE_URL = Config.API_BASE_URL || 'http://10.0.2.2:8000';

async function request<T>(path: string, body: unknown, language: AppLanguage): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Backend translates sign/planet/nakshatra names to Tamil when this
      // is "ta" (see astro-fast-api's app/astro/i18n.py); any other value
      // gets the English defaults.
      'Accept-Language': language,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = `Request to ${path} failed (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson?.detail) {
        detail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore JSON parse errors, keep default message
    }
    throw new Error(detail);
  }

  return (await response.json()) as T;
}

export const apiClient = { request };
