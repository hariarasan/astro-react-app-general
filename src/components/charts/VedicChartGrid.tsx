import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import { PLANET_ABBREVIATIONS, SIGN_ABBREVIATIONS, SIGN_GRID_POSITION } from '../../utils/constants';
import type { ChartResponse } from '../../types/astrology';

interface Props {
  chart: ChartResponse;
  title: string;
}

interface CellData {
  signIndex: number;
  sign: string;
  isLagna: boolean;
  planetLabels: string[];
}

export function VedicChartGrid({ chart, title }: Props) {
  const cells: CellData[] = useMemo(() => {
    return chart.houses
      .slice()
      .sort((a, b) => a.sign_index - b.sign_index)
      .map(house => ({
        signIndex: house.sign_index,
        sign: house.sign,
        isLagna: house.house_number === 1,
        planetLabels: house.planets.map(name => {
          const planet = chart.planets.find(p => p.name === name);
          // Fall back to the full (untruncated) name when there's no
          // abbreviation entry for it, rather than slicing characters -
          // slicing a Tamil string by code unit can split a base letter
          // from its combining vowel sign and render a broken glyph.
          const abbr = PLANET_ABBREVIATIONS[name] ?? name;
          return planet?.retrograde ? `${abbr}(R)` : abbr;
        }),
      }));
  }, [chart]);

  return (
    <View>
      <View style={styles.grid}>
        {cells.map(cell => {
          const [row, col] = SIGN_GRID_POSITION[cell.signIndex];
          return (
            <View
              key={cell.signIndex}
              style={[
                styles.cell,
                {
                  top: `${row * 25}%`,
                  left: `${col * 25}%`,
                },
                cell.isLagna && styles.lagnaCell,
              ]}>
              <Text
                style={styles.signLabel}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}>
                {SIGN_ABBREVIATIONS[cell.sign] ?? cell.sign}
              </Text>
              {cell.isLagna && <Text style={styles.ascLabel}>ASC</Text>}
              <View style={styles.planetsWrap}>
                {cell.planetLabels.map((label, idx) => (
                  <Text
                    key={idx}
                    style={styles.planetLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}>
                    {label}
                  </Text>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.centerBox}>
          <Text style={styles.centerTitle}>{title}</Text>
          <Text style={styles.centerSubtitle} numberOfLines={2}>
            Lagna: {chart.lagna.sign} {chart.lagna.degree_in_sign.toFixed(1)}°
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.redDark,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  cell: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  lagnaCell: {
    backgroundColor: colors.cream,
    borderWidth: 1.5,
    borderColor: colors.red,
  },
  signLabel: {
    ...typography.caption,
    // Explicit lineHeight (rather than relying on the font's default
    // metrics) keeps Tamil vowel signs like "ொ"/"ூ" from getting clipped
    // at the top/bottom when the label sits in a tightly-padded cell.
    lineHeight: 16,
    fontWeight: '700',
    color: colors.redDark,
    maxWidth: '100%',
  },
  ascLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    color: colors.red,
  },
  planetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 2,
  },
  planetLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: colors.black,
    marginHorizontal: 2,
    maxWidth: '100%',
  },
  centerBox: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  centerTitle: {
    ...typography.h3,
    color: colors.redDark,
    textAlign: 'center',
  },
  centerSubtitle: {
    fontSize: 10,
    lineHeight: 14,
    color: colors.black,
    textAlign: 'center',
    marginTop: 4,
  },
});
