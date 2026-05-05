export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD format
  description?: string;
  createdAt: number; // unix timestamp
}

export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Health' | 'Other';

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other'];
