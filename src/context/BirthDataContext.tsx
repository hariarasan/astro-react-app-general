import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  fetchAnalysis,
  fetchDasha,
  fetchMahapurushaYogas,
  fetchNavamsaChart,
  fetchRasiChart,
} from '../api/astrologyApi';
import { useLanguage } from './LanguageContext';
import { formatDateForApi, formatTimeForApi, getUtcOffsetHours } from '../services/timezone';
import { formatCityLabel } from '../services/geocoding';
import type { AstrologyBundle, BirthDetailsRequest } from '../types/astrology';
import type { BirthFormValues } from '../types/location';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface BirthDataContextValue {
  status: Status;
  errorMessage: string | null;
  bundle: AstrologyBundle | null;
  birthRequest: BirthDetailsRequest | null;
  displayName: string;
  submit: (values: BirthFormValues) => Promise<void>;
  reset: () => void;
}

const BirthDataContext = createContext<BirthDataContextValue | undefined>(undefined);

export function BirthDataProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bundle, setBundle] = useState<AstrologyBundle | null>(null);
  const [birthRequest, setBirthRequest] = useState<BirthDetailsRequest | null>(null);

  const submit = useCallback(
    async (values: BirthFormValues) => {
      if (!values.dateOfBirth || !values.birthTime || !values.location) {
        setErrorMessage('Please fill in date of birth, birth time, and birth location.');
        setStatus('error');
        return;
      }

      setStatus('loading');
      setErrorMessage(null);

      try {
        const offsetHours = getUtcOffsetHours(
          values.location.timezone,
          values.dateOfBirth,
          values.birthTime,
        );

        const request: BirthDetailsRequest = {
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          date_of_birth: formatDateForApi(values.dateOfBirth),
          time_of_birth: formatTimeForApi(values.birthTime),
          latitude: values.location.latitude,
          longitude: values.location.longitude,
          timezone_offset_hours: Math.round(offsetHours * 100) / 100,
          place_name: formatCityLabel(values.location),
        };

        const [rasi, navamsa, analysis, mahapurusha, dasha] = await Promise.all([
          fetchRasiChart(request, language),
          fetchNavamsaChart(request, language),
          fetchAnalysis(request, language),
          fetchMahapurushaYogas(request, language),
          fetchDasha(request, language),
        ]);

        setBirthRequest(request);
        setBundle({ rasi, navamsa, analysis, mahapurusha, dasha });
        setStatus('success');
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Something went wrong while fetching your chart. Please try again.';
        setErrorMessage(message);
        setStatus('error');
      }
    },
    [language],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
    setBundle(null);
    setBirthRequest(null);
  }, []);

  const displayName = useMemo(() => {
    if (!birthRequest) {
      return '';
    }
    return `${birthRequest.first_name} ${birthRequest.last_name}`.trim();
  }, [birthRequest]);

  const value: BirthDataContextValue = {
    status,
    errorMessage,
    bundle,
    birthRequest,
    displayName,
    submit,
    reset,
  };

  return <BirthDataContext.Provider value={value}>{children}</BirthDataContext.Provider>;
}

export function useBirthData(): BirthDataContextValue {
  const ctx = useContext(BirthDataContext);
  if (!ctx) {
    throw new Error('useBirthData must be used within a BirthDataProvider');
  }
  return ctx;
}
