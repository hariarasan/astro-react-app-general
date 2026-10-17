import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from '../../theme/theme';
import { PLANET_ABBREVIATIONS, PLANET_ORDER } from '../../utils/constants';

export function ChartLegend() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legend</Text>
      <View style={styles.row}>
        {PLANET_ORDER.map(planet => (
          <Text key={planet} style={styles.item}>
            {PLANET_ABBREVIATIONS[planet]} = {planet}
          </Text>
        ))}
      </View>
      <Text style={styles.note}>(R) = retrograde · ASC = ascendant / lagna</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.caption,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    ...typography.caption,
    marginRight: spacing.sm,
    marginBottom: 2,
  },
  note: {
    ...typography.caption,
    fontStyle: 'italic',
  },
});
