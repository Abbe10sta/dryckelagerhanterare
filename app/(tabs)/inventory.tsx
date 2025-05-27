import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Plus, AlertTriangle, Package } from 'lucide-react-native';
import { stockLevels } from '@/constants/colors';
import { BeverageCard } from '@/components/BeverageCard';
import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { useBeverageStore } from '@/store/beverageStore';
import { Beverage } from '@/types/beverage';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function InventoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const { beverages, searchBeverages, getLowStockBeverages, getOutOfStockBeverages, getMediumStockBeverages, getNormalStockBeverages } = useBeverageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'normal' | 'medium' | 'low' | 'out'>(
    params.filter === 'low' ? 'low' : 
    params.filter === 'out' ? 'out' : 
    params.filter === 'medium' ? 'medium' : 
    params.filter === 'normal' ? 'normal' : 'all'
  );
  
  const themeColors = useThemeColors();
  
  // Get beverages by stock level
  const lowStockBeverages = getLowStockBeverages();
  const outOfStockBeverages = getOutOfStockBeverages();
  const mediumStockBeverages = getMediumStockBeverages();
  const normalStockBeverages = getNormalStockBeverages();
  
  useEffect(() => {
    if (params.filter === 'low') {
      setActiveFilter('low');
    } else if (params.filter === 'out') {
      setActiveFilter('out');
    } else if (params.filter === 'medium') {
      setActiveFilter('medium');
    } else if (params.filter === 'normal') {
      setActiveFilter('normal');
    }
  }, [params.filter]);
  
  // Filter beverages based on search query and active filter
  const filteredBeverages = React.useMemo(() => {
    let result = searchQuery.trim() === '' ? beverages : searchBeverages(searchQuery);
    
    if (activeFilter === 'low') {
      result = result.filter(beverage => 
        lowStockBeverages.some(item => item.id === beverage.id)
      );
    } else if (activeFilter === 'out') {
      result = result.filter(beverage => 
        outOfStockBeverages.some(item => item.id === beverage.id)
      );
    } else if (activeFilter === 'medium') {
      result = result.filter(beverage => 
        mediumStockBeverages.some(item => item.id === beverage.id)
      );
    } else if (activeFilter === 'normal') {
      result = result.filter(beverage => 
        normalStockBeverages.some(item => item.id === beverage.id)
      );
    }
    
    return result;
  }, [beverages, searchQuery, activeFilter, lowStockBeverages, outOfStockBeverages, mediumStockBeverages, normalStockBeverages]);
  
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
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const setFilter = (filter: 'all' | 'normal' | 'medium' | 'low' | 'out') => {
    setActiveFilter(filter);
  };
  
  const renderItem = ({ item }: { item: Beverage }) => (
    <BeverageCard
      beverage={item}
      onEdit={handleEditBeverage}
      onConsume={handleConsume}
      onRestock={handleRestock}
    />
  );
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Lager</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: themeColors.primary }]}
          onPress={handleAddBeverage}
        >
          <Plus size={24} color={themeColors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Sök efter namn eller typ..."
        />
        
        <View style={styles.filterButtons}>
          <ScrollableFilterButtons 
            activeFilter={activeFilter} 
            setFilter={setFilter}
            beverages={beverages}
            lowStockBeverages={lowStockBeverages}
            outOfStockBeverages={outOfStockBeverages}
            mediumStockBeverages={mediumStockBeverages}
            normalStockBeverages={normalStockBeverages}
            themeColors={themeColors}
          />
        </View>
      </View>
      
      {beverages.length === 0 ? (
        <EmptyState message="Ditt lager är tomt. Lägg till drycker för att komma igång!" />
      ) : filteredBeverages.length === 0 ? (
        <EmptyState message={
          activeFilter === 'low' 
            ? "Inga drycker med lågt lager hittades." 
            : activeFilter === 'out'
              ? "Inga drycker som är slut i lager hittades."
              : activeFilter === 'medium'
                ? "Inga drycker med medium lager hittades."
                : activeFilter === 'normal'
                  ? "Inga drycker med bra lager hittades."
                  : "Inga drycker hittades som matchar din sökning."
        } />
      ) : (
        <FlatList
          data={filteredBeverages.sort((a, b) => a.name.localeCompare(b.name))}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={() => <View style={styles.bottomPadding} />}
        />
      )}
    </View>
  );
}

// Define interface for ScrollableFilterButtons props
interface ScrollableFilterButtonsProps {
  activeFilter: 'all' | 'normal' | 'medium' | 'low' | 'out';
  setFilter: (filter: 'all' | 'normal' | 'medium' | 'low' | 'out') => void;
  beverages: Beverage[];
  lowStockBeverages: Beverage[];
  outOfStockBeverages: Beverage[];
  mediumStockBeverages: Beverage[];
  normalStockBeverages: Beverage[];
  themeColors: {
    primary: string;
    secondary: string;
    background: string;
    white: string;
    text: string;
    darkGray: string;
    lightGray: string;
    danger: string;
    warning: string;
  };
}

// Separate component for scrollable filter buttons
const ScrollableFilterButtons: React.FC<ScrollableFilterButtonsProps> = ({ 
  activeFilter, 
  setFilter,
  beverages,
  lowStockBeverages,
  outOfStockBeverages,
  mediumStockBeverages,
  normalStockBeverages,
  themeColors
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterButtonsContainer}>
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'all' && styles.filterButtonActive,
          activeFilter === 'all' && { backgroundColor: themeColors.primary }
        ]}
        onPress={() => setFilter('all')}
      >
        <Package size={18} color={activeFilter === 'all' ? themeColors.white : themeColors.text} />
        <Text style={[
          styles.filterButtonText,
          { color: activeFilter === 'all' ? themeColors.white : themeColors.text }
        ]}>
          Alla ({beverages.length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'normal' && styles.filterButtonActive,
          activeFilter === 'normal' && { backgroundColor: stockLevels.normal }
        ]}
        onPress={() => setFilter('normal')}
      >
        <Package size={18} color={activeFilter === 'normal' ? themeColors.white : stockLevels.normal} />
        <Text style={[
          styles.filterButtonText,
          { color: activeFilter === 'normal' ? themeColors.white : themeColors.text }
        ]}>
          Bra ({normalStockBeverages.length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'medium' && styles.filterButtonActive,
          activeFilter === 'medium' && { backgroundColor: stockLevels.medium }
        ]}
        onPress={() => setFilter('medium')}
      >
        <Package size={18} color={activeFilter === 'medium' ? themeColors.white : stockLevels.medium} />
        <Text style={[
          styles.filterButtonText,
          { color: activeFilter === 'medium' ? themeColors.white : themeColors.text }
        ]}>
          Medium ({mediumStockBeverages.length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'low' && styles.filterButtonActive,
          activeFilter === 'low' && { backgroundColor: stockLevels.medium }
        ]}
        onPress={() => setFilter('low')}
      >
        <AlertTriangle size={18} color={activeFilter === 'low' ? themeColors.white : stockLevels.medium} />
        <Text style={[
          styles.filterButtonText,
          { color: activeFilter === 'low' ? themeColors.white : themeColors.text }
        ]}>
          Lågt ({lowStockBeverages.length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'out' && styles.filterButtonActive,
          activeFilter === 'out' && { backgroundColor: stockLevels.low }
        ]}
        onPress={() => setFilter('out')}
      >
        <AlertTriangle size={18} color={activeFilter === 'out' ? themeColors.white : stockLevels.low} />
        <Text style={[
          styles.filterButtonText,
          { color: activeFilter === 'out' ? themeColors.white : themeColors.text }
        ]}>
          Slut ({outOfStockBeverages.length})
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterButtons: {
    marginTop: 8,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E9F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#4A6FA5',
  },
  filterButtonText: {
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 100 : 80,
  }
});