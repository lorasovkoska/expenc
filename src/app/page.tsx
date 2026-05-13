'use client';

import { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { Charts } from '@/components/Charts';
import { FilterBar } from '@/components/FilterBar';

type ExpenseFilters = {
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
};

export default function Home() {
  const { expenses, isLoading, addExpense, deleteExpense } = useExpenses();

  const [filters, setFilters] = useState<ExpenseFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // apply filters and sorting
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (filters.category) {
      result = result.filter((e) => e.category === filters.category);
    }

    if (filters.startDate) {
      result = result.filter((e) => e.date >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter((e) => e.date <= filters.endDate!);
    }

    result.sort((a, b) => {
      let compareValue = 0;
      if (filters.sortBy === 'date') {
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        compareValue = a.amount - b.amount;
      }
      return filters.sortOrder === 'desc' ? -compareValue : compareValue;
    });

    return result;
  }, [expenses, filters]);

  const handleAddExpense = (data: {
    amount: number;
    category: string;
    date: string;
    description?: string;
  }) => {
    addExpense(data);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
          Expense Tracker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Charts expenses={filteredExpenses} />
            <FilterBar onFilterChange={setFilters} />
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Transactions</h2>
              <ExpenseList
                expenses={filteredExpenses}
                onDelete={deleteExpense}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
