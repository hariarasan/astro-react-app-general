import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BirthDetailsScreen } from '../screens/BirthDetailsScreen';
import { MainDrawer } from './MainDrawer';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BirthDetails" component={BirthDetailsScreen} />
      <Stack.Screen name="Main" component={MainDrawer} />
    </Stack.Navigator>
  );
}
