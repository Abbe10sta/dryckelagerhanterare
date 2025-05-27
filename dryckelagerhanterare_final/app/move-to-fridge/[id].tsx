import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useBeverageStore } from '@/store/beverageStore';
import { QuantityAdjuster } from '@/components/QuantityAdjuster';

export default function MoveToFridgeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const beverages = useBeverageStore((state) => state.beverages);
  const moveToFridge = useBeverageStore((state) => state.moveToFridge);
  
  const beverage = beverages.find((b) => b.id === id);
  const [modalVisible, setModalVisible] = useState(true);
  
  const handleClose = () => {
    setModalVisible(false);
    router.back();
  };
  
  const handleSubmit = (quantity: number) => {
    if (id && beverage) {
      moveToFridge(id, quantity);
      router.back();
    }
  };
  
  if (!beverage) {
    router.back();
    return null;
  }
  
  return (
    <View style={styles.container}>
      <QuantityAdjuster
        beverage={beverage}
        visible={modalVisible}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Flytta till kylskåp"
        maxQuantity={beverage.storageQuantity}
        buttonText="Flytta"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});