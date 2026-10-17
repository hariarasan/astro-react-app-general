import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';

import { useBirthData } from '../context/BirthDataContext';
import { useSectionScroll } from '../context/SectionScrollContext';
import type { SectionKey } from '../context/SectionScrollContext';
import { colors } from '../theme/colors';
import { radius, spacing, typography } from '../theme/theme';

const MENU_ITEMS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'charts', label: 'Chart', icon: '🪐' },
  { key: 'chartAnalysis', label: 'Chart Analysis', icon: '🔎' },
  { key: 'dasha', label: 'Dasha', icon: '⏳' },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { displayName, birthRequest, reset } = useBirthData();
  const { scrollToSection } = useSectionScroll();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.profileBox}>
        <Text style={styles.avatar}>🔯</Text>
        <Text style={styles.name}>{displayName || 'Your Chart'}</Text>
        {!!birthRequest?.place_name && <Text style={styles.place}>{birthRequest.place_name}</Text>}
      </View>

      <View style={styles.divider} />

      {MENU_ITEMS.map(item => (
        <DrawerItem
          key={item.key}
          label={`${item.icon}  ${item.label}`}
          inactiveTintColor={colors.black}
          labelStyle={styles.itemLabel}
          style={styles.item}
          onPress={() => {
            // All three sections live on one page now - jump the shared
            // ScrollView to the tapped section, then close the drawer,
            // rather than navigating to a separate screen.
            scrollToSection(item.key);
            props.navigation.closeDrawer();
          }}
        />
      ))}

      <View style={styles.divider} />

      <DrawerItem
        label="✏️  Edit Birth Details"
        labelStyle={styles.itemLabel}
        inactiveTintColor={colors.redDark}
        onPress={() => {
          reset();
          props.navigation.getParent()?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'BirthDetails' }],
            }),
          );
        }}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  profileBox: {
    backgroundColor: colors.red,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  avatar: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.h2,
    color: colors.white,
  },
  place: {
    ...typography.caption,
    color: colors.yellow,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGrey,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
  },
  item: {
    borderRadius: radius.md,
    marginHorizontal: spacing.sm,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
