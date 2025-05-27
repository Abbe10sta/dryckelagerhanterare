import React from 'react';
import { Tabs } from 'expo-router';
import { BarChart2, Package, ShoppingCart, Clock, Settings as SettingsIcon } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding for tab bar based on safe area
  const tabBarPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 8;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.darkGray,
        tabBarStyle: {
          backgroundColor: themeColors.white,
          borderTopWidth: 1,
          borderTopColor: themeColors.lightGray,
          height: Platform.OS === 'ios' ? 60 + tabBarPadding : 64,
          paddingBottom: tabBarPadding,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 4 : 0,
        },
        headerStyle: {
          backgroundColor: themeColors.white,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Översikt',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Lager',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reorder"
        options={{
          title: 'Beställ',
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historik',
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Inställningar',
          tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}