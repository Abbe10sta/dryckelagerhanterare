import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { BeverageCard } from '@/components/BeverageCard';
import { EmptyState } from '@/components/EmptyState';
import { useBeverageStore } from '@/store/beverageStore';
import { Beverage } from '@/types/beverage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReorderScreen() {
  const router = useRouter();
  const { getOutOfStockBeverages, getLowStockBeverages } = useBeverageStore();
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding for content based on safe area and tab bar height
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom + 60, 100) : 80;
  
  const outOfStockBeverages = getOutOfStockBeverages();
  const lowStockBeverages = getLowStockBeverages();
  
  const handleEditBeverage = (beverage: Beverage) => {
    router.push(`/edit-beverage/${beverage.id}`);
  };
  
  const handleRestock = (beverage: Beverage) => {
    router.push(`/restock/${beverage.id}`);
  };
  
  const renderItem = ({ item }: { item: Beverage }) => (
    <BeverageCard
      beverage={item}
      onEdit={handleEditBeverage}
      onRestock={handleRestock}
      compact={true}
    />
  );
  
  const needsReorder = outOfStockBeverages.length > 0 || lowStockBeverages.length > 0;
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Att beställa</Text>
        <View style={[styles.countBadge, { backgroundColor: themeColors.danger }]}>
          <Text style={[styles.countText, { color: themeColors.white }]}>
            {outOfStockBeverages.length + lowStockBeverages.length}
          </Text>
        </View>
      </View>
      
      {!needsReorder ? (
        <EmptyState message="Alla drycker har tillräckligt lager. Inget behöver beställas just nu." />
      ) : (
        <FlatList
          data={[...outOfStockBeverages, ...lowStockBeverages]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <ShoppingCart size={20} color={themeColors.primary} />
              <Text style={[styles.listHeaderText, { color: themeColors.text }]}>
                Drycker som behöver beställas
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  countBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});