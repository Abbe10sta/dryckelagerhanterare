import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBeverageStore } from '@/store/beverageStore';
import { useThemeColors } from '@/hooks/useThemeColors';

export const StockSummary = () => {
  const router = useRouter();
  const { beverages, getLowStockBeverages, getOutOfStockBeverages } = useBeverageStore();
  const themeColors = useThemeColors();
  
  const totalProducts = beverages.length;
  const totalItems = beverages.reduce((sum, item) => sum + item.quantity, 0);
  
  const lowStockCount = getLowStockBeverages().length;
  const outOfStockCount = getOutOfStockBeverages().length;
  
  const handleViewLowStock = () => {
    router.push('/inventory?filter=low');
  };
  
  const handleViewOutOfStock = () => {
    router.push('/inventory?filter=out');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: themeColors.white }]}>
          <Text style={[styles.cardTitle, { color: themeColors.darkGray }]}>Antal produkter</Text>
          <Text style={[styles.cardValue, { color: themeColors.text }]}>{totalProducts}</Text>
        </View>
        
        <View style={[styles.card, { backgroundColor: themeColors.white }]}>
          <Text style={[styles.cardTitle, { color: themeColors.darkGray }]}>Totalt antal</Text>
          <Text style={[styles.cardValue, { color: themeColors.text }]}>{totalItems}</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.card, styles.warningCard, { backgroundColor: themeColors.white }]}
          onPress={handleViewLowStock}
        >
          <Text style={[styles.cardTitle, { color: themeColors.darkGray }]}>Lågt lager</Text>
          <Text style={[styles.cardValue, styles.warningText]}>{lowStockCount}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.card, styles.dangerCard, { backgroundColor: themeColors.white }]}
          onPress={handleViewOutOfStock}
        >
          <Text style={[styles.cardTitle, { color: themeColors.darkGray }]}>Slut i lager</Text>
          <Text style={[styles.cardValue, styles.dangerText]}>{outOfStockCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F6AD55',
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E53E3E',
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#F6AD55',
  },
  dangerText: {
    color: '#E53E3E',
  },
});