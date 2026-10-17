import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../theme/colors';

export function ScreenHeaderMenuButton() {
  const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  return (
    <TouchableOpacity
      accessibilityLabel="Open menu"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={() => navigation.toggleDrawer()}
      style={styles.button}>
      <Text style={styles.icon}>☰</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: '700',
  },
});
