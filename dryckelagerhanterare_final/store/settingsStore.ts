import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  lowStockThreshold: number;
  mediumStockThreshold: number;
  themeMode: ThemeMode;
  updateLowStockThreshold: (value: number) => void;
  updateMediumStockThreshold: (value: number) => void;
  updateThemeMode: (mode: ThemeMode) => void;
  isDarkMode: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      lowStockThreshold: 5,
      mediumStockThreshold: 10,
      themeMode: 'system',
      
      updateLowStockThreshold: (value: number) => {
        set({ lowStockThreshold: value });
      },
      
      updateMediumStockThreshold: (value: number) => {
        set({ mediumStockThreshold: value });
      },
      
      updateThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },
      
      isDarkMode: () => {
        const { themeMode } = get();
        if (themeMode === 'system') {
          return Appearance.getColorScheme() === 'dark';
        }
        return themeMode === 'dark';
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);