'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/types/expense';

interface FilterBarProps {
  onFilterChange: (filters: {
    category?: string;
    startDate?: string;
    endDate?: string;
    sortBy: 'date' | 'amount';
    sortOrder: 'asc' | 'desc';
  }) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // fire off filter updates whenever anything changes
  const updateFilters = (
    newCategory?: string,
    newStartDate?: string,
    newEndDate?: string,
    newSortBy?: 'date' | 'amount',
    newSortOrder?: 'asc' | 'desc'
  ) => {
    onFilterChange({
      category: newCategory || undefined,
      startDate: newStartDate || undefined,
      endDate: newEndDate || undefined,
      sortBy: newSortBy || sortBy,
      sortOrder: newSortOrder || sortOrder,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    setCategory(newCat);
    updateFilters(newCat, startDate, endDate, sortBy, sortOrder);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    updateFilters(category, newStart, endDate, sortBy, sortOrder);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    updateFilters(category, startDate, newEnd, sortBy, sortOrder);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc';
    const [newSort, newOrder] = value.split('-') as ['date' | 'amount', 'asc' | 'desc'];
    setSortBy(newSort);
    setSortOrder(newOrder);
    updateFilters(category, startDate, endDate, newSort, newOrder);
  };

  const handleReset = () => {
    setCategory('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
    updateFilters('', '', '', 'date', 'desc');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">Filters &amp; Sort</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="filter-category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-sort" className="block text-sm font-medium mb-1">
            Sort By
          </label>
          <select
            id="filter-sort"
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="w-full p-2 border rounded"
            aria-label="Sort expenses"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-start-date" className="block text-sm font-medium mb-1">
            From Date
          </label>
          <input
            id="filter-start-date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full p-2 border rounded"
            aria-label="Filter from date"
          />
        </div>

        <div>
          <label htmlFor="filter-end-date" className="block text-sm font-medium mb-1">
            To Date
          </label>
          <input
            id="filter-end-date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="w-full p-2 border rounded"
            aria-label="Filter to date"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="w-full bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300"
        aria-label="Reset all filters"
      >
        Reset Filters
      </button>
    </div>
  );
}
