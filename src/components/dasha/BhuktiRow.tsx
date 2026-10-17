import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import { formatDisplayDate, formatYears } from '../../utils/formatters';
import type { BhuktiPeriod } from '../../types/astrology';

interface Props {
  bhukti: BhuktiPeriod;
}

export function BhuktiRow({ bhukti }: Props) {
  return (
    <View style={[styles.row, bhukti.is_current && styles.currentRow]}>
      <View style={styles.leftCol}>
        <Text style={[styles.lord, bhukti.is_current && styles.currentText]}>{bhukti.lord}</Text>
        {bhukti.is_current && <Text style={styles.nowBadge}>NOW</Text>}
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.dates}>
          {formatDisplayDate(bhukti.start_date)} – {formatDisplayDate(bhukti.end_date)}
        </Text>
        <Text style={styles.duration}>{formatYears(bhukti.duration_years)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  currentRow: {
    backgroundColor: colors.yellow,
    borderRadius: radius.sm,
    borderBottomWidth: 0,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lord: {
    ...typography.body,
    fontWeight: '600',
  },
  currentText: {
    color: colors.redDark,
    fontWeight: '800',
  },
  nowBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    backgroundColor: colors.red,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  dates: {
    ...typography.caption,
  },
  duration: {
    ...typography.caption,
    color: colors.grey,
  },
});
