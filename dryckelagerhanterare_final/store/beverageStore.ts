import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Beverage, BeverageFormData, InventoryAction } from '@/types/beverage';
import { useSettingsStore } from './settingsStore';

interface BeverageState {
  beverages: Beverage[];
  history: InventoryAction[];
  addBeverage: (data: BeverageFormData) => void;
  updateBeverage: (id: string, data: Partial<BeverageFormData>) => void;
  deleteBeverage: (id: string) => void;
  addToStorage: (id: string, quantity: number) => void;
  consumeFromStorage: (id: string, quantity: number) => void;
  clearHistory: () => void;
  searchBeverages: (query: string) => Beverage[];
  getLowStockBeverages: () => Beverage[];
  getOutOfStockBeverages: () => Beverage[];
  getMediumStockBeverages: () => Beverage[];
  getNormalStockBeverages: () => Beverage[];
  getStockLevel: (quantity: number) => 'normal' | 'medium' | 'low' | 'out';
}

export const useBeverageStore = create<BeverageState>()(
  persist(
    (set, get) => ({
      beverages: [],
      history: [],
      
      addBeverage: (data: BeverageFormData) => {
        // Ensure price is a valid number
        const safePrice = isNaN(data.price) ? 0 : data.price;
        const safeQuantity = isNaN(data.quantity) ? 0 : data.quantity;
        
        const newBeverage: Beverage = {
          id: Date.now().toString(),
          name: data.name,
          type: data.type,
          price: safePrice,
          imageUri: data.imageUri,
          quantity: safeQuantity,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        const newAction: InventoryAction = {
          id: Date.now().toString(),
          beverageId: newBeverage.id,
          beverageName: newBeverage.name,
          actionType: 'add',
          quantity: safeQuantity,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          beverages: [...state.beverages, newBeverage],
          history: [newAction, ...state.history],
        }));
      },
      
      updateBeverage: (id: string, data: Partial<BeverageFormData>) => {
        // Ensure price is a valid number if provided
        const safePrice = data.price !== undefined ? (isNaN(data.price) ? 0 : data.price) : undefined;
        
        set((state) => ({
          beverages: state.beverages.map((beverage) => 
            beverage.id === id 
              ? { 
                  ...beverage, 
                  name: data.name ?? beverage.name,
                  type: data.type ?? beverage.type,
                  price: safePrice ?? beverage.price,
                  imageUri: data.imageUri ?? beverage.imageUri,
                  updatedAt: Date.now() 
                } 
              : beverage
          ),
        }));
      },
      
      deleteBeverage: (id: string) => {
        set((state) => ({
          beverages: state.beverages.filter((beverage) => beverage.id !== id),
        }));
      },
      
      addToStorage: (id: string, quantity: number) => {
        if (isNaN(quantity) || quantity <= 0) return;
        
        const beverage = get().beverages.find(b => b.id === id);
        if (!beverage) return;
        
        const newAction: InventoryAction = {
          id: Date.now().toString(),
          beverageId: id,
          beverageName: beverage.name,
          actionType: 'add',
          quantity: quantity,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          beverages: state.beverages.map((beverage) => 
            beverage.id === id 
              ? { 
                  ...beverage, 
                  quantity: beverage.quantity + quantity,
                  updatedAt: Date.now() 
                } 
              : beverage
          ),
          history: [newAction, ...state.history],
        }));
      },
      
      consumeFromStorage: (id: string, quantity: number) => {
        if (isNaN(quantity) || quantity <= 0) return;
        
        const beverage = get().beverages.find(b => b.id === id);
        if (!beverage || beverage.quantity < quantity) return;
        
        const newAction: InventoryAction = {
          id: Date.now().toString(),
          beverageId: id,
          beverageName: beverage.name,
          actionType: 'consume',
          quantity: quantity,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          beverages: state.beverages.map((beverage) => 
            beverage.id === id 
              ? { 
                  ...beverage, 
                  quantity: beverage.quantity - quantity,
                  updatedAt: Date.now() 
                } 
              : beverage
          ),
          history: [newAction, ...state.history],
        }));
      },
      
      clearHistory: () => {
        // Completely replace the history with an empty array
        set({ history: [] });
      },
      
      searchBeverages: (query: string) => {
        const { beverages } = get();
        if (!query.trim()) return beverages;
        
        const lowerQuery = query.toLowerCase();
        return beverages.filter(
          (beverage) => 
            beverage.name.toLowerCase().includes(lowerQuery) || 
            beverage.type.toLowerCase().includes(lowerQuery)
        );
      },
      
      getStockLevel: (quantity: number) => {
        const { lowStockThreshold, mediumStockThreshold } = useSettingsStore.getState();
        
        if (quantity === 0) return 'out';
        if (quantity < lowStockThreshold) return 'low';
        if (quantity < mediumStockThreshold) return 'medium';
        return 'normal';
      },
      
      getLowStockBeverages: () => {
        const { lowStockThreshold } = useSettingsStore.getState();
        return get().beverages.filter((beverage) => {
          return beverage.quantity > 0 && beverage.quantity < lowStockThreshold;
        });
      },
      
      getOutOfStockBeverages: () => {
        return get().beverages.filter((beverage) => {
          return beverage.quantity === 0;
        });
      },
      
      getMediumStockBeverages: () => {
        const { lowStockThreshold, mediumStockThreshold } = useSettingsStore.getState();
        return get().beverages.filter((beverage) => {
          return beverage.quantity >= lowStockThreshold && beverage.quantity < mediumStockThreshold;
        });
      },
      
      getNormalStockBeverages: () => {
        const { mediumStockThreshold } = useSettingsStore.getState();
        return get().beverages.filter((beverage) => {
          return beverage.quantity >= mediumStockThreshold;
        });
      },
    }),
    {
      name: 'beverage-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);