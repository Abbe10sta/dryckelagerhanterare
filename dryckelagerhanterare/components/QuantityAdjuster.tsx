import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import { Beverage } from '@/types/beverage';
import { useThemeColors } from '@/hooks/useThemeColors';

interface QuantityAdjusterProps {
  beverage: Beverage;
  visible: boolean;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  title: string;
  maxQuantity?: number;
  buttonText: string;
}

export const QuantityAdjuster = ({
  beverage,
  visible,
  onClose,
  onSubmit,
  title,
  maxQuantity,
  buttonText
}: QuantityAdjusterProps) => {
  const [quantity, setQuantity] = useState('1');
  const themeColors = useThemeColors();
  
  const handleSubmit = () => {
    const parsedQuantity = parseInt(quantity) || 0;
    if (parsedQuantity > 0) {
      onSubmit(parsedQuantity);
      setQuantity('1');
      onClose();
    }
  };
  
  const handleQuantityChange = (text: string) => {
    const parsedQuantity = parseInt(text) || 0;
    
    if (text === '') {
      setQuantity('');
      return;
    }
    
    if (maxQuantity !== undefined && parsedQuantity > maxQuantity) {
      setQuantity(maxQuantity.toString());
    } else {
      setQuantity(isNaN(parsedQuantity) ? '0' : parsedQuantity.toString());
    }
  };
  
  // Ensure we have a valid number for the button disabled state
  const parsedQuantity = parseInt(quantity) || 0;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={[styles.modalView, { backgroundColor: themeColors.white }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.beverageName, { color: themeColors.text }]}>{beverage.name}</Text>
          
          {maxQuantity !== undefined && (
            <Text style={[styles.maxQuantity, { color: themeColors.darkGray }]}>
              Tillgängligt: {maxQuantity} st
            </Text>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Antal:</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: themeColors.background,
                borderColor: themeColors.lightGray,
                color: themeColors.text
              }]}
              value={quantity}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              autoFocus
              placeholderTextColor={themeColors.darkGray}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton, { backgroundColor: themeColors.lightGray }]} 
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: themeColors.text }]}>Avbryt</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.submitButton,
                { backgroundColor: themeColors.primary },
                (parsedQuantity <= 0) && styles.disabledButton,
                (parsedQuantity <= 0) && { backgroundColor: themeColors.lightGray, opacity: 0.5 }
              ]} 
              onPress={handleSubmit}
              disabled={parsedQuantity <= 0}
            >
              <Text style={[styles.submitButtonText, { color: themeColors.white }]}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  beverageName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  maxQuantity: {
    fontSize: 14,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    marginLeft: 8,
  },
  disabledButton: {
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  submitButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});