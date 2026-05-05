'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { generateId } from '@/utils/formatters';

const STORAGE_KEY = 'expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setExpenses(JSON.parse(saved));
      }
    } catch (error) {
      // localStorage might be full or corrupted
      console.error('failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // save to localStorage whenever expenses change
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
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    saveToStorage(updated);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    saveToStorage(updated);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    );
    setExpenses(updated);
    saveToStorage(updated);
  };

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    updateExpense,
  };
}
