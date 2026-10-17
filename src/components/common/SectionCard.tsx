import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing, typography } from '../../theme/theme';

interface Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: boolean;
}

export function SectionCard({ title, subtitle, children, style, accent = false }: Props) {
  return (
    <View style={[styles.card, accent && styles.accentCard, style]}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    ...shadow.card,
  },
  accentCard: {
    borderColor: colors.yellow,
    borderWidth: 2,
  },
  title: {
    ...typography.h3,
    color: colors.redDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
});
