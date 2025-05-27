import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BeverageForm } from '@/components/BeverageForm';
import { useBeverageStore } from '@/store/beverageStore';
import { BeverageFormData } from '@/types/beverage';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function EditBeverageScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const themeColors = useThemeColors();
  
  const beverages = useBeverageStore((state) => state.beverages);
  const updateBeverage = useBeverageStore((state) => state.updateBeverage);
  
  const beverage = beverages.find((b) => b.id === id);
  
  const handleSubmit = (data: BeverageFormData) => {
    if (id) {
      updateBeverage(id, data);
      router.back();
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  if (!beverage) {
    router.back();
    return null;
  }
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <BeverageForm
        initialData={beverage}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});