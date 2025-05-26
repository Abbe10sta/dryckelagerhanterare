import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StockLevelIndicator } from './StockLevelIndicator';
import { useThemeColors } from '@/hooks/useThemeColors';

export const StockLevelLegend = () => {
  const themeColors = useThemeColors();
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.white }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Lagernivåer</Text>
      <View style={styles.legendItems}>
        <View style={styles.legendItem}>
          <StockLevelIndicator level="normal" />
        </View>
        <View style={styles.legendItem}>
          <StockLevelIndicator level="medium" />
        </View>
        <View style={styles.legendItem}>
          <StockLevelIndicator level="low" />
        </View>
        <View style={styles.legendItem}>
          <StockLevelIndicator level="out" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    marginBottom: 8,
    width: '48%',
  }
});