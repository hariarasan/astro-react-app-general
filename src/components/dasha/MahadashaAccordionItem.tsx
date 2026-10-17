import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import { formatDisplayDate, formatYears } from '../../utils/formatters';
import { BhuktiRow } from './BhuktiRow';
import type { MahadashaPeriod } from '../../types/astrology';

interface Props {
  mahadasha: MahadashaPeriod;
  initiallyExpanded?: boolean;
}

export function MahadashaAccordionItem({ mahadasha, initiallyExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <View style={[styles.container, mahadasha.is_current && styles.currentContainer]}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.75}
        onPress={() => setExpanded(prev => !prev)}>
        <View style={styles.headerLeft}>
          <Text style={styles.lordText}>{mahadasha.lord} Mahadasha</Text>
          {mahadasha.is_current && <Text style={styles.currentBadge}>CURRENT</Text>}
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Text style={styles.dates}>
        {formatDisplayDate(mahadasha.start_date)} – {formatDisplayDate(mahadasha.end_date)} ·{' '}
        {formatYears(mahadasha.duration_years)}
      </Text>

      {expanded && (
        <View style={styles.bhuktiList}>
          {mahadasha.bhuktis.map((bhukti, idx) => (
            <BhuktiRow key={`${bhukti.lord}-${idx}`} bhukti={bhukti} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  currentContainer: {
    borderColor: colors.red,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lordText: {
    ...typography.h3,
  },
  currentBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    backgroundColor: colors.red,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  chevron: {
    color: colors.redDark,
    fontWeight: '700',
  },
  dates: {
    ...typography.caption,
    marginTop: 2,
  },
  bhuktiList: {
    marginTop: spacing.sm,
  },
});
