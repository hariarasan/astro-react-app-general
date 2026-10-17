import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import { formatDisplayDate } from '../../utils/formatters';
import type { CurrentDashaInfo } from '../../types/astrology';

interface Props {
  current: CurrentDashaInfo;
}

export function CurrentPeriodBanner({ current }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.asOf}>As of {formatDisplayDate(current.as_of_date)}</Text>
      <View style={styles.periodsRow}>
        <View style={styles.periodBox}>
          <Text style={styles.periodLabel}>Mahadasha</Text>
          <Text style={styles.periodLord}>{current.mahadasha.lord}</Text>
          <Text style={styles.periodDates}>
            till {formatDisplayDate(current.mahadasha.end_date)}
          </Text>
        </View>
        <View style={styles.periodBox}>
          <Text style={styles.periodLabel}>Bhukti</Text>
          <Text style={styles.periodLord}>{current.bhukti.lord}</Text>
          <Text style={styles.periodDates}>till {formatDisplayDate(current.bhukti.end_date)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.yellow,
  },
  asOf: {
    ...typography.caption,
    color: colors.yellow,
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  periodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  periodBox: {
    alignItems: 'center',
  },
  periodLabel: {
    ...typography.caption,
    color: colors.white,
  },
  periodLord: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  periodDates: {
    ...typography.caption,
    color: colors.yellow,
  },
});
