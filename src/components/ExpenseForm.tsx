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
      className="space-y-4 p-4 sm:p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold">Add New Expense</h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount ($)</label>
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

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
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

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
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

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description <span className="text-gray-400 font-normal">(optional)</span>
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
        <p className="text-xs text-gray-500 mt-1">{description.length}/100</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        aria-label="Add expense"
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
