import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

export default function Index() {
  // Handle notifications warning gracefully
  useEffect(() => {
    if (Platform.OS !== 'web') {
      console.log('Note: Push notifications functionality is limited in Expo Go. For full functionality, use a development build.');
    }
  }, []);

  // Redirect to the tabs
  return <Redirect href="/(tabs)" />;
}