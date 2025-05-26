import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, AlertTriangle, Package, ShoppingCart } from 'lucide-react-native';
import { stockLevels } from '@/constants/colors';
import { StockSummary } from '@/components/StockSummary';
import { StockLevelLegend } from '@/components/StockLevelLegend';
import { BeverageCard } from '@/components/BeverageCard';
import { EmptyState } from '@/components/EmptyState';
import { useBeverageStore } from '@/store/beverageStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Beverage } from '@/types/beverage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const router = useRouter();
  const { beverages, getLowStockBeverages, getOutOfStockBeverages, getMediumStockBeverages, getNormalStockBeverages } = useBeverageStore();
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();
  
  const lowStockBeverages = getLowStockBeverages();
  const outOfStockBeverages = getOutOfStockBeverages();
  const mediumStockBeverages = getMediumStockBeverages();
  const normalStockBeverages = getNormalStockBeverages();
  
  const handleAddBeverage = () => {
    router.push('/add-beverage');
  };
  
  const handleEditBeverage = (beverage: Beverage) => {
    router.push(`/edit-beverage/${beverage.id}`);
  };
  
  const handleConsume = (beverage: Beverage) => {
    router.push(`/consume/${beverage.id}`);
  };
  
  const handleRestock = (beverage: Beverage) => {
    router.push(`/restock/${beverage.id}`);
  };
  
  const handleViewLowStock = () => {
    router.push('/inventory?filter=low');
  };
  
  const handleViewOutOfStock = () => {
    router.push('/inventory?filter=out');
  };
  
  // Calculate bottom padding for content based on safe area and tab bar height
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom + 60, 100) : 80;
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Dryckeslager</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: themeColors.primary }]}
            onPress={handleAddBeverage}
          >
            <Plus size={24} color={themeColors.white} />
          </TouchableOpacity>
        </View>
        
        <StockSummary />
        
        <StockLevelLegend />
        
        {outOfStockBeverages.length > 0 && (
          <View style={[styles.alertSection, { 
            backgroundColor: themeColors.white,
            borderLeftColor: stockLevels.low
          }]}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color={stockLevels.low} />
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Slut i lager</Text>
              <TouchableOpacity 
                style={[styles.viewAllButton, { backgroundColor: themeColors.lightGray }]}
                onPress={handleViewOutOfStock}
              >
                <Text style={[styles.viewAllText, { color: themeColors.text }]}>Visa alla</Text>
              </TouchableOpacity>
            </View>
            
            {outOfStockBeverages.slice(0, 3).map((beverage) => (
              <BeverageCard
                key={beverage.id}
                beverage={beverage}
                onEdit={handleEditBeverage}
                onRestock={handleRestock}
              />
            ))}
            
            {outOfStockBeverages.length > 3 && (
              <TouchableOpacity 
                style={[styles.moreButton, { borderTopColor: themeColors.lightGray }]}
                onPress={handleViewOutOfStock}
              >
                <Text style={[styles.moreButtonText, { color: themeColors.primary }]}>
                  Visa {outOfStockBeverages.length - 3} till...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {lowStockBeverages.length > 0 && (
          <View style={[styles.alertSection, { 
            backgroundColor: themeColors.white,
            borderLeftColor: stockLevels.medium
          }]}>
            <View style={styles.sectionHeader}>
              <ShoppingCart size={20} color={stockLevels.medium} />
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Lågt lager</Text>
              <TouchableOpacity 
                style={[styles.viewAllButton, { backgroundColor: themeColors.lightGray }]}
                onPress={handleViewLowStock}
              >
                <Text style={[styles.viewAllText, { color: themeColors.text }]}>Visa alla</Text>
              </TouchableOpacity>
            </View>
            
            {lowStockBeverages.slice(0, 3).map((beverage) => (
              <BeverageCard
                key={beverage.id}
                beverage={beverage}
                onEdit={handleEditBeverage}
                onRestock={handleRestock}
                onConsume={handleConsume}
              />
            ))}
            
            {lowStockBeverages.length > 3 && (
              <TouchableOpacity 
                style={[styles.moreButton, { borderTopColor: themeColors.lightGray }]}
                onPress={handleViewLowStock}
              >
                <Text style={[styles.moreButtonText, { color: themeColors.primary }]}>
                  Visa {lowStockBeverages.length - 3} till...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {mediumStockBeverages.length > 0 && (
          <View style={[styles.section, { backgroundColor: themeColors.white }]}>
            <View style={styles.sectionHeader}>
              <Package size={20} color={themeColors.secondary} />
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Medium lager</Text>
            </View>
            
            {mediumStockBeverages.slice(0, 2).map((beverage) => (
              <BeverageCard
                key={beverage.id}
                beverage={beverage}
                onEdit={handleEditBeverage}
                onRestock={handleRestock}
                onConsume={handleConsume}
              />
            ))}
            
            {mediumStockBeverages.length > 2 && (
              <TouchableOpacity 
                style={[styles.moreButton, { borderTopColor: themeColors.lightGray }]}
                onPress={() => router.push('/inventory?filter=medium')}
              >
                <Text style={[styles.moreButtonText, { color: themeColors.primary }]}>
                  Visa {mediumStockBeverages.length - 2} till...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {normalStockBeverages.length > 0 && (
          <View style={[styles.section, { backgroundColor: themeColors.white }]}>
            <View style={styles.sectionHeader}>
              <Package size={20} color={stockLevels.normal} />
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Bra lager</Text>
            </View>
            
            {normalStockBeverages.slice(0, 2).map((beverage) => (
              <BeverageCard
                key={beverage.id}
                beverage={beverage}
                onEdit={handleEditBeverage}
                onRestock={handleRestock}
                onConsume={handleConsume}
              />
            ))}
            
            {normalStockBeverages.length > 2 && (
              <TouchableOpacity 
                style={[styles.moreButton, { borderTopColor: themeColors.lightGray }]}
                onPress={() => router.push('/inventory?filter=normal')}
              >
                <Text style={[styles.moreButtonText, { color: themeColors.primary }]}>
                  Visa {normalStockBeverages.length - 2} till...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {beverages.length === 0 && (
          <EmptyState message="Ditt lager är tomt. Lägg till drycker för att komma igång!" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  alertSection: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  viewAllText: {
    fontWeight: '500',
    fontSize: 12,
  },
  moreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
  },
  moreButtonText: {
    fontWeight: '600',
  },
});