import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MinusCircle, Package } from 'lucide-react-native';
import { InventoryAction } from '@/types/beverage';
import { useThemeColors } from '@/hooks/useThemeColors';

interface HistoryItemProps {
  action: InventoryAction;
}

export const HistoryItem = ({ action }: HistoryItemProps) => {
  const themeColors = useThemeColors();
  
  const getActionIcon = () => {
    switch (action.actionType) {
      case 'add':
        return <Package size={20} color={themeColors.primary} />;
      case 'consume':
        return <MinusCircle size={20} color={themeColors.danger} />;
      default:
        return null;
    }
  };
  
  const getActionText = () => {
    switch (action.actionType) {
      case 'add':
        return `Lade till ${action.quantity} st ${action.beverageName} i lager`;
      case 'consume':
        return `Tog ut ${action.quantity} st ${action.beverageName} från lager`;
      default:
        return '';
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.white }]}>
      <View style={[styles.iconContainer, { backgroundColor: themeColors.lightGray }]}>
        {getActionIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.actionText, { color: themeColors.text }]}>{getActionText()}</Text>
        <Text style={[styles.timestamp, { color: themeColors.darkGray }]}>{formatDate(action.timestamp)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
  },
});