import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Package } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({ message = "Inga drycker hittades" }: EmptyStateProps) => {
  const themeColors = useThemeColors();
  
  return (
    <View style={styles.container}>
      <Package size={64} color={themeColors.lightGray} />
      <Text style={[styles.message, { color: themeColors.darkGray }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});