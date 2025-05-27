import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { BeverageCard } from '@/components/BeverageCard';
import { EmptyState } from '@/components/EmptyState';
import { useBeverageStore } from '@/store/beverageStore';
import { Beverage } from '@/types/beverage';

export default function SearchScreen() {
  const router = useRouter();
  const { beverages, searchBeverages } = useBeverageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(beverages);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(beverages);
    } else {
      setSearchResults(searchBeverages(searchQuery));
    }
  }, [searchQuery, beverages]);
  
  const handleEditBeverage = (beverage: Beverage) => {
    router.push(`/edit-beverage/${beverage.id}`);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const renderItem = ({ item }: { item: Beverage }) => (
    <BeverageCard
      beverage={item}
      onEdit={handleEditBeverage}
    />
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search by name or type..."
        />
      </View>
      
      {beverages.length === 0 ? (
        <EmptyState message="Your inventory is empty. Add some beverages first!" />
      ) : searchResults.length === 0 ? (
        <EmptyState message="No beverages found matching your search." />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
});