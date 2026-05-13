'use client';

import { Expense, Category } from '@/types/expense';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CategoryBadge } from './CategoryBadge';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ExpenseList({ expenses, onDelete, isLoading }: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 text-center" role="status" aria-live="polite">
        Loading expenses...
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center text-gray-500">
        <p>No expenses yet.</p>
        <p className="text-sm">Add one above to get started!</p>
      </div>
    );
  }

  // order comes from parent (filters / sort bar) — don't re-sort here

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="p-3 sm:p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-600"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CategoryBadge category={expense.category as Category} />
                <span className="text-sm text-gray-500">{formatDate(expense.date)}</span>
              </div>
              {expense.description && (
                <p className="text-sm text-gray-700">{expense.description}</p>
              )}
            </div>
            <div className="text-left sm:text-right sm:ml-4 shrink-0">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(expense.id)}
            className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            aria-label={`Delete expense ${formatCurrency(expense.amount)} on ${formatDate(expense.date)}`}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
