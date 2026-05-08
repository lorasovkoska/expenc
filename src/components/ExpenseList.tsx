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
      <div className="p-6 text-center" role="status" aria-live="polite">
        Loading expenses...
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No expenses yet.</p>
        <p className="text-sm">Add one above to get started!</p>
      </div>
    );
  }

  // sort by date descending (newest first)
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <div className="space-y-2">
      {sorted.map((expense) => (
        <div
          key={expense.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-600"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CategoryBadge category={expense.category as Category} />
                <span className="text-sm text-gray-500">{formatDate(expense.date)}</span>
              </div>
              {expense.description && (
                <p className="text-sm text-gray-700">{expense.description}</p>
              )}
            </div>
            <div className="text-right ml-4">
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
