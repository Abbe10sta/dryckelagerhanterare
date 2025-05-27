import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Settings, Save, Moon, Sun, Smartphone } from 'lucide-react-native';
import { useSettingsStore, ThemeMode } from '@/store/settingsStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { 
    lowStockThreshold, 
    mediumStockThreshold, 
    themeMode,
    updateLowStockThreshold, 
    updateMediumStockThreshold,
    updateThemeMode,
    isDarkMode
  } = useSettingsStore();
  
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding for content based on safe area and tab bar height
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom + 60, 100) : 80;
  
  const [lowThreshold, setLowThreshold] = useState(lowStockThreshold.toString());
  const [mediumThreshold, setMediumThreshold] = useState(mediumStockThreshold.toString());
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    // Update input values when store values change
    setLowThreshold(lowStockThreshold.toString());
    setMediumThreshold(mediumStockThreshold.toString());
  }, [lowStockThreshold, mediumStockThreshold]);
  
  const handleSave = () => {
    const lowValue = parseInt(lowThreshold);
    const mediumValue = parseInt(mediumThreshold);
    
    if (!isNaN(lowValue) && lowValue >= 0) {
      updateLowStockThreshold(lowValue);
    }
    
    if (!isNaN(mediumValue) && mediumValue > lowValue) {
      updateMediumStockThreshold(mediumValue);
    } else if (!isNaN(mediumValue)) {
      // Ensure medium threshold is always higher than low threshold
      updateMediumStockThreshold(lowValue + 1);
      setMediumThreshold((lowValue + 1).toString());
    }
    
    // Show saved indicator
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };
  
  const handleLowThresholdChange = (text: string) => {
    setLowThreshold(text);
    setIsSaved(false);
  };
  
  const handleMediumThresholdChange = (text: string) => {
    setMediumThreshold(text);
    setIsSaved(false);
  };
  
  const handleThemeChange = (newTheme: ThemeMode) => {
    updateThemeMode(newTheme);
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomPadding }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Inställningar</Text>
        <Settings size={24} color={themeColors.primary} />
      </View>
      
      <View style={[styles.section, { backgroundColor: themeColors.white }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Utseende</Text>
        <Text style={[styles.sectionDescription, { color: themeColors.darkGray }]}>
          Välj mellan ljust och mörkt tema, eller följ systemets inställningar.
        </Text>
        
        <View style={styles.themeOptions}>
          <TouchableOpacity 
            style={[
              styles.themeOption, 
              themeMode === 'light' && styles.selectedThemeOption,
              themeMode === 'light' && { borderColor: themeColors.primary }
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <Sun size={24} color={themeMode === 'light' ? themeColors.primary : themeColors.darkGray} />
            <Text style={[
              styles.themeOptionText, 
              { color: themeMode === 'light' ? themeColors.primary : themeColors.text }
            ]}>
              Ljust
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.themeOption, 
              themeMode === 'dark' && styles.selectedThemeOption,
              themeMode === 'dark' && { borderColor: themeColors.primary }
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <Moon size={24} color={themeMode === 'dark' ? themeColors.primary : themeColors.darkGray} />
            <Text style={[
              styles.themeOptionText, 
              { color: themeMode === 'dark' ? themeColors.primary : themeColors.text }
            ]}>
              Mörkt
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.themeOption, 
              themeMode === 'system' && styles.selectedThemeOption,
              themeMode === 'system' && { borderColor: themeColors.primary }
            ]}
            onPress={() => handleThemeChange('system')}
          >
            <Smartphone size={24} color={themeMode === 'system' ? themeColors.primary : themeColors.darkGray} />
            <Text style={[
              styles.themeOptionText, 
              { color: themeMode === 'system' ? themeColors.primary : themeColors.text }
            ]}>
              System
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.currentThemeText, { color: themeColors.darkGray }]}>
          Aktuellt tema: {isDarkMode() ? 'Mörkt' : 'Ljust'}
        </Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: themeColors.white }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Lagernivåer</Text>
        <Text style={[styles.sectionDescription, { color: themeColors.darkGray }]}>
          Anpassa tröskelvärdena för lagernivåer. Dessa värden används för att avgöra när en produkt har lågt lager eller bra lager.
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Lågt lager (mindre än)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: themeColors.background,
              borderColor: themeColors.lightGray,
              color: themeColors.text
            }]}
            value={lowThreshold}
            onChangeText={handleLowThresholdChange}
            keyboardType="numeric"
            placeholder="5"
            placeholderTextColor={themeColors.darkGray}
          />
          <Text style={[styles.helperText, { color: themeColors.darkGray }]}>
            Produkter med färre än detta antal kommer att markeras som "lågt lager"
          </Text>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>Bra lager (mer än eller lika med)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: themeColors.background,
              borderColor: themeColors.lightGray,
              color: themeColors.text
            }]}
            value={mediumThreshold}
            onChangeText={handleMediumThresholdChange}
            keyboardType="numeric"
            placeholder="10"
            placeholderTextColor={themeColors.darkGray}
          />
          <Text style={[styles.helperText, { color: themeColors.darkGray }]}>
            Produkter med detta antal eller fler kommer att markeras som "bra lager"
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: themeColors.primary }]}
          onPress={handleSave}
        >
          <Save size={20} color={themeColors.white} />
          <Text style={[styles.saveButtonText, { color: themeColors.white }]}>Spara inställningar</Text>
        </TouchableOpacity>
        
        {isSaved && (
          <Text style={[styles.savedIndicator, { color: themeColors.primary }]}>Inställningar sparade!</Text>
        )}
      </View>
      
      <View style={[styles.section, { backgroundColor: themeColors.white }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Om appen</Text>
        <Text style={[styles.aboutText, { color: themeColors.darkGray }]}>
          Dryckeslager v1.0.0
        </Text>
        <Text style={[styles.aboutText, { color: themeColors.darkGray }]}>
          En app för att hålla koll på ditt lager av drycker.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  selectedThemeOption: {
    borderWidth: 2,
  },
  themeOptionText: {
    marginTop: 8,
    fontWeight: '600',
  },
  currentThemeText: {
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  saveButtonText: {
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  savedIndicator: {
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});