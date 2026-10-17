import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import type { SeventhLordInfo } from '../../types/astrology';

interface Props {
  info: SeventhLordInfo;
}

export function SeventhLordCard({ info }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Lagna is <Text style={styles.bold}>{info.lagna_sign}</Text>, so the 7th house falls in{' '}
        <Text style={styles.bold}>{info.seventh_house_sign}</Text>, ruled by{' '}
        <Text style={styles.bold}>{info.lord}</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.yellow,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.black,
  },
  bold: {
    fontWeight: '800',
    color: colors.redDark,
  },
});
