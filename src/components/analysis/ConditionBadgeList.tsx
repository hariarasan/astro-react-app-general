import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import type { PlanetCondition } from '../../types/astrology';

interface Props {
  label: string;
  helperText?: string;
  planets: PlanetCondition[];
  emptyText?: string;
}

export function ConditionBadgeList({ label, helperText, planets, emptyText = 'None' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {!!helperText && <Text style={styles.helper}>{helperText}</Text>}
      {planets.length === 0 ? (
        <Text style={styles.empty}>{emptyText}</Text>
      ) : (
        <View style={styles.row}>
          {planets.map(planet => (
            <View key={planet.name} style={styles.badge}>
              <Text style={styles.badgeTitle}>{planet.name}</Text>
              <Text style={styles.badgeSub}>
                {planet.sign} · H{planet.house} · {planet.degree_in_sign.toFixed(1)}°
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.h3,
    marginBottom: 2,
  },
  helper: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  empty: {
    ...typography.body,
    color: colors.grey,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  badgeTitle: {
    fontWeight: '700',
    color: colors.redDark,
  },
  badgeSub: {
    ...typography.caption,
  },
});
