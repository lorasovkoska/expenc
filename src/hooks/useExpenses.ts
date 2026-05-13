'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { generateId } from '@/utils/formatters';

const STORAGE_KEY = 'expenses';

// guard against half-corrupted localStorage data
const isValidExpense = (item: unknown): item is Expense => {
  if (!item || typeof item !== 'object') return false;
  const e = item as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.amount === 'number' &&
    Number.isFinite(e.amount) &&
    typeof e.category === 'string' &&
    typeof e.date === 'string' &&
    typeof e.createdAt === 'number' &&
    Number.isFinite(e.createdAt) &&
    (e.description === undefined || typeof e.description === 'string')
  );
};

const parseStoredExpenses = (raw: string): Expense[] => {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isValidExpense);
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const list = parseStoredExpenses(saved);
        setExpenses(list);
        const parsed: unknown = JSON.parse(saved);
        // had array entries but none survived validation — storage is junk
        if (Array.isArray(parsed) && parsed.length > 0 && list.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      // localStorage might be full or corrupted
      console.error('failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveToStorage = (newExpenses: Expense[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
    } catch (error) {
      // quota exceeded or other error
      console.error('failed to save expenses:', error);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: Date.now(),
    };
    setExpenses((prev) => {
      const updated = [...prev, newExpense];
      saveToStorage(updated);
      return updated;
    });
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => {
      const updated = prev.filter((exp) => exp.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => {
      const updated = prev.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      );
      saveToStorage(updated);
      return updated;
    });
  };

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    updateExpense,
  };
}
