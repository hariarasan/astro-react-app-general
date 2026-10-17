import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import type { NodeTrineOccupants } from '../../types/astrology';

interface Props {
  trine: NodeTrineOccupants;
}

function formatList(names: string[]): string {
  return names.length > 0 ? names.join(', ') : 'None';
}

export function TrineOccupantsCard({ trine }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {trine.node} <Text style={styles.sub}>({trine.node_sign})</Text>
      </Text>
      <View style={styles.rowsWrap}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>1st (own sign)</Text>
          <Text style={styles.rowValue}>{formatList(trine.house_1)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>5th from {trine.node}</Text>
          <Text style={styles.rowValue}>{formatList(trine.house_5)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>9th from {trine.node}</Text>
          <Text style={styles.rowValue}>{formatList(trine.house_9)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  sub: {
    ...typography.caption,
    fontWeight: '400',
  },
  rowsWrap: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  rowLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  rowValue: {
    ...typography.body,
    color: colors.grey,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.sm,
  },
});
