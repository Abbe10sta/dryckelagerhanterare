export interface Beverage {
  id: string;
  name: string;
  quantity: number;
  type: string;
  price: number;
  imageUri?: string;
  createdAt: number;
  updatedAt: number;
}

export type BeverageFormData = Omit<Beverage, 'id' | 'createdAt' | 'updatedAt'>;

export const beverageTypes = [
  'Läsk',
  'Vatten',
  'Juice',
  'Energidryck',
  'Te',
  'Kaffe',
  'Mjölk',
  'Öl',
  'Cider',
  'Annan',
];

export interface InventoryAction {
  id: string;
  beverageId: string;
  beverageName: string;
  actionType: 'add' | 'consume';
  quantity: number;
  timestamp: number;
}