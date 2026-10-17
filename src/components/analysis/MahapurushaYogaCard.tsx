import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';
import type { MahapurushaCandidate } from '../../types/astrology';

interface Props {
  candidate: MahapurushaCandidate;
}

export function MahapurushaYogaCard({ candidate }: Props) {
  return (
    <View style={[styles.container, candidate.yoga_present && styles.presentContainer]}>
      <View style={styles.headerRow}>
        <Text style={styles.yogaName}>{candidate.yoga}</Text>
        <Text style={[styles.status, candidate.yoga_present && styles.statusPresent]}>
          {candidate.yoga_present ? 'Formed' : 'Not formed'}
        </Text>
      </View>
      <Text style={styles.detail}>
        {candidate.planet} in {candidate.sign} (House {candidate.house})
      </Text>
      <Text style={styles.detail}>
        In Kendra: {candidate.in_kendra ? 'Yes' : 'No'} · Own sign: {candidate.own_sign ? 'Yes' : 'No'} ·
        Exalted: {candidate.exalted ? 'Yes' : 'No'}
      </Text>
      {!!candidate.reason && <Text style={styles.reason}>Reason: {candidate.reason}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  presentContainer: {
    borderColor: colors.red,
    borderWidth: 2,
    backgroundColor: colors.cream,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  yogaName: {
    ...typography.h3,
  },
  status: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.grey,
  },
  statusPresent: {
    color: colors.red,
  },
  detail: {
    ...typography.caption,
  },
  reason: {
    ...typography.caption,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
