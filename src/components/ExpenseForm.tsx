'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/types/expense';
import { validateExpenseForm } from '@/utils/validation';

interface ExpenseFormProps {
  onSubmit: (data: {
    amount: number;
    category: string;
    date: string;
    description?: string;
  }) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);

    // validate everything before submitting
    const validationError = validateExpenseForm(
      parsedAmount,
      category,
      date,
      description,
      CATEGORIES
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit({
        amount: parsedAmount,
        category,
        date,
        description: description || undefined,
      });

      // reset form after successful submit
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // get today's date for the max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-gray-100 bg-white p-5 shadow sm:p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900">Add New Expense</h2>

      {error && (
        <div className="rounded-md bg-red-100 p-3 text-red-700" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-sm font-medium text-gray-700">
          Amount ($)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
          aria-label="Expense amount in dollars"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
          aria-label="Expense category"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
          aria-label="Expense date"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes..."
          maxLength={100}
          className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={isSubmitting}
          aria-label="Expense description"
        />
        <p className="text-xs text-gray-500">{description.length}/100</p>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          aria-label="Add expense"
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
