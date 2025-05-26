import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { BeverageForm } from '@/components/BeverageForm';
import { useBeverageStore } from '@/store/beverageStore';
import { BeverageFormData } from '@/types/beverage';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function AddBeverageScreen() {
  const router = useRouter();
  const addBeverage = useBeverageStore((state) => state.addBeverage);
  const themeColors = useThemeColors();
  
  const handleSubmit = (data: BeverageFormData) => {
    addBeverage(data);
    router.back();
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <BeverageForm
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