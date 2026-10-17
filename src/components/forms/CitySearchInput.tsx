import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { formatCityLabel, searchCities } from '../../services/geocoding';
import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import type { CitySuggestion } from '../../types/location';

interface Props {
  value: CitySuggestion | null;
  onSelect: (city: CitySuggestion) => void;
  error?: string | null;
}

export function CitySearchInput({ value, onSelect, error }: Props) {
  const [query, setQuery] = useState(value ? formatCityLabel(value) : '');
  const [results, setResults] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value && query === formatCityLabel(value)) {
      setResults([]);
      return;
    }

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const cities = await searchCities(query);
        setResults(cities);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSelect = (city: CitySuggestion) => {
    onSelect(city);
    setQuery(formatCityLabel(city));
    setResults([]);
    setShowResults(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Birth Location (City)</Text>
      <View style={[styles.field, !!error && styles.fieldError]}>
        <TextInput
          value={query}
          onChangeText={text => {
            setQuery(text);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Start typing a city name…"
          placeholderTextColor={colors.grey}
          style={styles.input}
        />
        {loading && <ActivityIndicator size="small" color={colors.red} />}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}

      {/*
        Plain View + .map() instead of FlatList: results are capped at 10
        short rows by the geocoding service, so virtualization buys nothing
        here, and a FlatList nested inside the screen's outer ScrollView
        (same vertical orientation) triggers React Native's "VirtualizedLists
        should never be nested inside plain ScrollViews" warning/overlay.
      */}
      {showResults && results.length > 0 && (
        <View style={styles.resultsBox}>
          {results.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.resultRow}
              onPress={() => handleSelect(item)}>
              <Text style={styles.resultText}>{formatCityLabel(item)}</Text>
              <Text style={styles.resultSub}>{item.timezone}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {value && (
        <Text style={styles.coords}>
          Lat {value.latitude.toFixed(4)}, Lon {value.longitude.toFixed(4)} · {value.timezone}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    zIndex: 10,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
    color: colors.black,
    fontWeight: '600',
  },
  field: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.black,
  },
  resultsBox: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginTop: spacing.xs,
  },
  resultRow: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  resultText: {
    fontSize: 15,
    color: colors.black,
  },
  resultSub: {
    ...typography.caption,
  },
  coords: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
