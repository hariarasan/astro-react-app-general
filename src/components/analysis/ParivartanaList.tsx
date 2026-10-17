import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import type { ParivartanaYoga } from '../../types/astrology';

interface Props {
  yogas: ParivartanaYoga[];
}

export function ParivartanaList({ yogas }: Props) {
  if (yogas.length === 0) {
    return <Text style={styles.empty}>No mutual sign exchanges (Parivarthanai) found.</Text>;
  }

  return (
    <View>
      {yogas.map((yoga, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.text}>
            <Text style={styles.planet}>{yoga.planet_a}</Text> ({yoga.sign_a}) ⇄{' '}
            <Text style={styles.planet}>{yoga.planet_b}</Text> ({yoga.sign_b})
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    ...typography.body,
    color: colors.grey,
    fontStyle: 'italic',
  },
  row: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    ...typography.body,
  },
  planet: {
    fontWeight: '700',
    color: colors.redDark,
  },
});
