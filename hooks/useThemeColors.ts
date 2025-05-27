import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { colors, darkColors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

export function useThemeColors() {
  const { themeMode, isDarkMode } = useSettingsStore();
  const [currentColors, setCurrentColors] = useState(isDarkMode() ? darkColors : colors);
  
  useEffect(() => {
    // Initial setup
    setCurrentColors(isDarkMode() ? darkColors : colors);
    
    // Listen for appearance changes if using system theme
    if (themeMode === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setCurrentColors(colorScheme === 'dark' ? darkColors : colors);
      });
      
      return () => {
        subscription.remove();
      };
    }
  }, [themeMode, isDarkMode]);
  
  // Update colors when theme mode changes
  useEffect(() => {
    setCurrentColors(isDarkMode() ? darkColors : colors);
  }, [isDarkMode]);
  
  return currentColors;
}