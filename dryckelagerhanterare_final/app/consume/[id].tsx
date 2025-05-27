import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBeverageStore } from '@/store/beverageStore';
import { QuantityAdjuster } from '@/components/QuantityAdjuster';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ConsumeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const themeColors = useThemeColors();
  
  const beverages = useBeverageStore((state) => state.beverages);
  const consumeFromStorage = useBeverageStore((state) => state.consumeFromStorage);
  
  const beverage = beverages.find((b) => b.id === id);
  const [modalVisible, setModalVisible] = useState(true);
  
  const handleClose = () => {
    setModalVisible(false);
    router.back();
  };
  
  const handleSubmit = (quantity: number) => {
    if (id && beverage) {
      consumeFromStorage(id, quantity);
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
        title="Ta ut från lager"
        maxQuantity={beverage.quantity}
        buttonText="Ta ut"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});