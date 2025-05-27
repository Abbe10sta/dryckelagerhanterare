import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { Beverage, BeverageFormData, beverageTypes } from '@/types/beverage';
import { X, Camera, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemeColors } from '@/hooks/useThemeColors';

interface BeverageFormProps {
  initialData?: Beverage;
  onSubmit: (data: BeverageFormData) => void;
  onCancel: () => void;
}

export const BeverageForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: BeverageFormProps) => {
  const themeColors = useThemeColors();
  
  const [formData, setFormData] = useState<BeverageFormData>({
    name: '',
    quantity: 0,
    type: beverageTypes[0],
    price: 0,
    imageUri: undefined,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BeverageFormData, string>>>({});
  const [selectedType, setSelectedType] = useState<string>(beverageTypes[0]);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity,
        type: initialData.type,
        price: initialData.price,
        imageUri: initialData.imageUri,
      });
      setSelectedType(initialData.type);
    }
  }, [initialData]);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BeverageFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Namn krävs';
    }
    
    if (isNaN(formData.quantity) || formData.quantity < 0) {
      newErrors.quantity = 'Antal måste vara 0 eller högre';
    }
    
    if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Pris måste vara större än 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        type: selectedType,
        // Ensure price and quantity are valid numbers
        price: isNaN(formData.price) ? 0 : formData.price,
        quantity: isNaN(formData.quantity) ? 0 : formData.quantity
      });
    }
  };
  
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, type }));
  };
  
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Behörighet nekad', 'Vi behöver tillgång till ditt bildbibliotek för att välja en bild.');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFormData(prev => ({ ...prev, imageUri: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Fel', 'Kunde inte välja bild. Försök igen.');
    }
  };
  
  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Behörighet nekad', 'Vi behöver tillgång till din kamera för att ta en bild.');
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFormData(prev => ({ ...prev, imageUri: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Fel', 'Kunde inte ta bild. Försök igen.');
    }
  };
  
  const placeholderImage = 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80';
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.keyboardAvoid, { backgroundColor: themeColors.background }]}
    >
      <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {initialData ? 'Redigera dryck' : 'Lägg till ny dryck'}
          </Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <X size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageSection}>
          <View style={[styles.imageContainer, { backgroundColor: themeColors.lightGray }]}>
            {formData.imageUri ? (
              <Image source={{ uri: formData.imageUri }} style={styles.image} />
            ) : (
              <Image source={{ uri: placeholderImage }} style={styles.image} />
            )}
          </View>
          
          <View style={styles.imageButtons}>
            <TouchableOpacity 
              style={[styles.imageButton, { backgroundColor: themeColors.primary }]} 
              onPress={takePhoto}
            >
              <Camera size={20} color={themeColors.white} />
              <Text style={[styles.imageButtonText, { color: themeColors.white }]}>Ta bild</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.imageButton, { backgroundColor: themeColors.primary }]} 
              onPress={pickImage}
            >
              <ImageIcon size={20} color={themeColors.white} />
              <Text style={[styles.imageButtonText, { color: themeColors.white }]}>Välj bild</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Namn</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: themeColors.white,
              borderColor: themeColors.lightGray,
              color: themeColors.text
            }]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ange dryckens namn"
            placeholderTextColor={themeColors.darkGray}
          />
          {errors.name && <Text style={[styles.errorText, { color: themeColors.danger }]}>{errors.name}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Typ</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.typeContainer}
          >
            {beverageTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  { backgroundColor: themeColors.lightGray },
                  selectedType === type && styles.selectedTypeButton,
                  selectedType === type && { backgroundColor: themeColors.primary }
                ]}
                onPress={() => handleTypeSelect(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: themeColors.text },
                    selectedType === type && styles.selectedTypeButtonText,
                    selectedType === type && { color: themeColors.white }
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Antal i lager</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: themeColors.white,
              borderColor: themeColors.lightGray,
              color: themeColors.text
            }]}
            value={formData.quantity.toString()}
            onChangeText={(text) => {
              const quantity = parseInt(text) || 0;
              setFormData({ ...formData, quantity: isNaN(quantity) ? 0 : Math.max(0, quantity) });
            }}
            keyboardType="numeric"
            placeholder="Ange antal"
            placeholderTextColor={themeColors.darkGray}
          />
          {errors.quantity && <Text style={[styles.errorText, { color: themeColors.danger }]}>{errors.quantity}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Pris (kr)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: themeColors.white,
              borderColor: themeColors.lightGray,
              color: themeColors.text
            }]}
            value={formData.price.toString()}
            onChangeText={(text) => {
              const price = parseFloat(text) || 0;
              setFormData({ ...formData, price: isNaN(price) ? 0 : price });
            }}
            keyboardType="decimal-pad"
            placeholder="Ange pris"
            placeholderTextColor={themeColors.darkGray}
          />
          {errors.price && <Text style={[styles.errorText, { color: themeColors.danger }]}>{errors.price}</Text>}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton, { backgroundColor: themeColors.lightGray }]} 
            onPress={onCancel}
          >
            <Text style={[styles.cancelButtonText, { color: themeColors.text }]}>Avbryt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.submitButton, { backgroundColor: themeColors.primary }]} 
            onPress={handleSubmit}
          >
            <Text style={[styles.submitButtonText, { color: themeColors.white }]}>
              {initialData ? 'Uppdatera' : 'Lägg till'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  imageButtonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  formGroup: {
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
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedTypeButton: {
  },
  typeButtonText: {
    fontWeight: '500',
  },
  selectedTypeButtonText: {
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    marginLeft: 8,
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