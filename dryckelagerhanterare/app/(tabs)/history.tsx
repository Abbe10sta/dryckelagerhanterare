import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import { HistoryItem } from '@/components/HistoryItem';
import { EmptyState } from '@/components/EmptyState';
import { useBeverageStore } from '@/store/beverageStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { history, clearHistory } = useBeverageStore();
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding for content based on safe area and tab bar height
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom + 60, 100) : 80;
  
  const handleClearHistory = () => {
    Alert.alert(
      "Rensa historik",
      "Är du säker på att du vill rensa all historik? Detta kan inte ångras.",
      [
        {
          text: "Avbryt",
          style: "cancel"
        },
        { 
          text: "Rensa", 
          onPress: () => {
            clearHistory();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Historik</Text>
        {history.length > 0 && (
          <TouchableOpacity 
            style={[styles.clearButton, { backgroundColor: themeColors.lightGray }]}
            onPress={handleClearHistory}
          >
            <Trash2 size={20} color={themeColors.danger} />
            <Text style={[styles.clearButtonText, { color: themeColors.danger }]}>Rensa</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {history.length === 0 ? (
        <EmptyState message="Ingen historik än. Aktiviteter kommer att visas här." />
      ) : (
        <FlatList
          data={history}
          renderItem={({ item }) => <HistoryItem action={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <Clock size={20} color={themeColors.primary} />
              <Text style={[styles.listHeaderText, { color: themeColors.text }]}>
                Senaste aktiviteter
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});