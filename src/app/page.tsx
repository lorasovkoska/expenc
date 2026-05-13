'use client';

import { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { Charts } from '@/components/Charts';
import { FilterBar } from '@/components/FilterBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
    <ErrorBoundary>
      <main className="min-h-screen w-full bg-gray-50 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Expense Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
              Add expenses on the left — charts and your transaction list update on the right.
            </p>
          </header>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-1">
              <ExpenseForm onSubmit={handleAddExpense} />
            </div>

            <div className="flex flex-col gap-8 lg:col-span-2">
              <Charts expenses={filteredExpenses} />
              <FilterBar onFilterChange={setFilters} />
              <div className="rounded-lg border border-gray-100 bg-white p-5 shadow sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-gray-900">Transactions</h2>
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
    </ErrorBoundary>
  );
}
