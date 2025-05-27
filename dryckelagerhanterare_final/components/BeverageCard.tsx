import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Trash2, Edit, MinusCircle, Package } from 'lucide-react-native';
import { Beverage } from '@/types/beverage';
import { stockLevels } from '@/constants/colors';
import { useBeverageStore } from '@/store/beverageStore';
import { useThemeColors } from '@/hooks/useThemeColors';

interface BeverageCardProps {
  beverage: Beverage;
  onEdit: (beverage: Beverage) => void;
  onConsume?: (beverage: Beverage) => void;
  onRestock?: (beverage: Beverage) => void;
  compact?: boolean;
}

export const BeverageCard = ({ 
  beverage, 
  onEdit, 
  onConsume,
  onRestock,
  compact = false 
}: BeverageCardProps) => {
  const { deleteBeverage, getStockLevel } = useBeverageStore();
  const themeColors = useThemeColors();
  
  const getStockColor = (quantity: number) => {
    const level = getStockLevel(quantity);
    switch (level) {
      case 'out':
      case 'low':
        return stockLevels.low;
      case 'medium':
        return stockLevels.medium;
      case 'normal':
        return stockLevels.normal;
      default:
        return stockLevels.normal;
    }
  };

  const handleDelete = () => {
    deleteBeverage(beverage.id);
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80';

  // Ensure price is a valid number
  const safePrice = isNaN(beverage.price) ? 0 : beverage.price;

  if (compact) {
    return (
      <View style={[styles.compactCard, { backgroundColor: themeColors.white }]}>
        <View style={styles.compactImageContainer}>
          {beverage.imageUri ? (
            <Image source={{ uri: beverage.imageUri }} style={styles.compactImage} />
          ) : (
            <Image source={{ uri: placeholderImage }} style={styles.compactImage} />
          )}
        </View>
        
        <View style={styles.compactContent}>
          <Text style={[styles.compactName, { color: themeColors.text }]}>{beverage.name}</Text>
          <Text style={[styles.compactType, { color: themeColors.darkGray }]}>{beverage.type}</Text>
          <View style={styles.compactStockInfo}>
            <Text style={[styles.compactLabel, { color: themeColors.darkGray }]}>I lager:</Text>
            <Text style={[
              styles.compactStockValue, 
              { color: getStockColor(beverage.quantity) }
            ]}>
              {beverage.quantity}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton, { backgroundColor: themeColors.primary }]} 
          onPress={() => onEdit(beverage)}
        >
          <Edit size={18} color={themeColors.white} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[
      styles.card,
      { backgroundColor: themeColors.white },
      beverage.quantity === 0 && styles.outOfStockCard,
      beverage.quantity > 0 && beverage.quantity < 5 && styles.lowStockCard
    ]}>
      <View style={styles.cardHeader}>
        <View style={[styles.imageContainer, { backgroundColor: themeColors.lightGray }]}>
          {beverage.imageUri ? (
            <Image source={{ uri: beverage.imageUri }} style={styles.image} />
          ) : (
            <Image source={{ uri: placeholderImage }} style={styles.image} />
          )}
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: themeColors.text }]}>{beverage.name}</Text>
          <Text style={[styles.type, { color: themeColors.darkGray }]}>{beverage.type}</Text>
          <Text style={[styles.price, { color: themeColors.text }]}>{safePrice} kr</Text>
        </View>
      </View>
      
      <View style={[styles.stockInfo, { borderBottomColor: themeColors.lightGray }]}>
        <View style={styles.stockItem}>
          <Text style={[styles.stockLabel, { color: themeColors.darkGray }]}>I lager:</Text>
          <Text style={[
            styles.stockValue, 
            { color: getStockColor(beverage.quantity) }
          ]}>
            {beverage.quantity}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        {onRestock && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.restockButton, { backgroundColor: themeColors.secondary }]} 
            onPress={() => onRestock(beverage)}
          >
            <Package size={18} color={themeColors.white} />
            <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Fyll på</Text>
          </TouchableOpacity>
        )}
        
        {onConsume && beverage.quantity > 0 && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.consumeButton, { backgroundColor: themeColors.warning }]} 
            onPress={() => onConsume(beverage)}
          >
            <MinusCircle size={18} color={themeColors.white} />
            <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Ta ut</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton, { backgroundColor: themeColors.primary }]} 
          onPress={() => onEdit(beverage)}
        >
          <Edit size={18} color={themeColors.white} />
          <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Ändra</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton, { backgroundColor: themeColors.danger }]} 
          onPress={handleDelete}
        >
          <Trash2 size={18} color={themeColors.white} />
          <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Ta bort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outOfStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: stockLevels.low,
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: stockLevels.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  stockItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  stockLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  stockValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  restockButton: {
  },
  consumeButton: {
  },
  editButton: {
  },
  deleteButton: {
  },
  
  // Compact card styles
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#E5E9F0',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
  },
  compactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  compactType: {
    fontSize: 12,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactStockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  compactLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  compactStockValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});