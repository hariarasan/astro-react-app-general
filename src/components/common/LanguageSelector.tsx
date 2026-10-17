import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/theme';
import type { AppLanguage } from '../../types/language';

const OPTIONS: { code: AppLanguage; label: string }[] = [
  { code: 'ta', label: 'தமிழ்' },
  { code: 'en', label: 'English' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      {OPTIONS.map(option => {
        const active = option.code === language;
        return (
          <TouchableOpacity
            key={option.code}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => setLanguage(option.code)}
            style={[styles.pill, active && styles.pillActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 3,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    minWidth: 76,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: colors.yellow,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.grey,
  },
  labelActive: {
    color: colors.redDark,
  },
});
