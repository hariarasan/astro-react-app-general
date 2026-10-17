import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';

import { CustomDrawerContent } from './CustomDrawerContent';
import { AllSectionsScreen } from '../screens/AllSectionsScreen';
import { SectionScrollProvider } from '../context/SectionScrollContext';
import { colors } from '../theme/colors';
import type { DrawerParamList } from './types';

const Drawer = createDrawerNavigator<DrawerParamList>();

function renderDrawerContent(props: DrawerContentComponentProps) {
  return <CustomDrawerContent {...props} />;
}

// All three report sections (Chart, Chart Analysis, Dasha) render on one
// scrollable page (AllSectionsScreen). The hamburger menu items scroll to
// the tapped section instead of navigating to a separate screen - see
// SectionScrollProvider/CustomDrawerContent.
export function MainDrawer() {
  return (
    <SectionScrollProvider>
      <Drawer.Navigator
        initialRouteName="Main"
        drawerContent={renderDrawerContent}
        screenOptions={{
          headerStyle: { backgroundColor: colors.red },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '800' },
          drawerActiveBackgroundColor: colors.yellow,
          drawerActiveTintColor: colors.black,
          drawerInactiveTintColor: colors.black,
          sceneStyle: { backgroundColor: colors.cream },
        }}>
        <Drawer.Screen
          name="Main"
          component={AllSectionsScreen}
          options={{ title: 'Your Astrology Report' }}
        />
      </Drawer.Navigator>
    </SectionScrollProvider>
  );
}
