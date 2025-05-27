import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { stockLevels } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useThemeColors } from '@/hooks/useThemeColors';

interface StockLevelIndicatorProps {
  level: 'normal' | 'medium' | 'low' | 'out';
  showLabel?: boolean;
}

export const StockLevelIndicator = ({ 
  level, 
  showLabel = true 
}: StockLevelIndicatorProps) => {
  const { lowStockThreshold, mediumStockThreshold } = useSettingsStore();
  const themeColors = useThemeColors();
  
  const getLabel = () => {
    switch (level) {
      case 'normal': return `Bra (${mediumStockThreshold}+)`;
      case 'medium': return `Medium (${lowStockThreshold}-${mediumStockThreshold - 1})`;
      case 'low': return `Lågt (1-${lowStockThreshold - 1})`;
      case 'out': return 'Slut i lager (0)';
      default: return '';
    }
  };

  const getColor = () => {
    switch (level) {
      case 'normal': return stockLevels.normal;
      case 'medium': return stockLevels.medium;
      case 'low': return stockLevels.low;
      case 'out': return stockLevels.low;
      default: return stockLevels.normal;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.lightGray }]}>
      <View style={[styles.indicator, { backgroundColor: getColor() }]} />
      {showLabel && <Text style={[styles.label, { color: themeColors.text }]}>{getLabel()}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 2,
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});