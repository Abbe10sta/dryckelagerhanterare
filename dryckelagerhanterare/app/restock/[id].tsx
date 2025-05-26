import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBeverageStore } from '@/store/beverageStore';
import { QuantityAdjuster } from '@/components/QuantityAdjuster';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function RestockScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const themeColors = useThemeColors();
  
  const beverages = useBeverageStore((state) => state.beverages);
  const addToStorage = useBeverageStore((state) => state.addToStorage);
  
  const beverage = beverages.find((b) => b.id === id);
  const [modalVisible, setModalVisible] = useState(true);
  
  const handleClose = () => {
    setModalVisible(false);
    router.back();
  };
  
  const handleSubmit = (quantity: number) => {
    if (id && beverage) {
      addToStorage(id, quantity);
      router.back();
    }
  };
  
  if (!beverage) {
    router.back();
    return null;
  }
  
  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <QuantityAdjuster
        beverage={beverage}
        visible={modalVisible}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Fyll på lager"
        buttonText="Lägg till"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});