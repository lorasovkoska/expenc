'use client';

import { Expense, CATEGORIES } from '@/types/expense';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { StatsCard } from './StatsCard';

interface ChartsProps {
  expenses: Expense[];
}

export function Charts({ expenses }: ChartsProps) {
  if (expenses.length === 0) {
    return (
      <section
        className="rounded-lg border border-gray-100 bg-white p-8 shadow sm:p-10"
        aria-labelledby="overview-heading"
      >
        <h2 id="overview-heading" className="mb-3 text-lg font-semibold text-gray-900">
          Overview
        </h2>
        <p className="mx-auto max-w-md text-center text-sm text-gray-500 sm:text-base">
          Add expenses to see charts and statistics
        </p>
      </section>
    );
  }

  // calculate stats
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const average = expenses.length > 0 ? total / expenses.length : 0;
  const count = expenses.length;

  // prepare pie chart data (by category)
  const categoryData = CATEGORIES.map((cat) => {
    const sum = expenses
      .filter((e) => e.category === cat)
      .reduce((acc, e) => acc + e.amount, 0);
    return {
      name: cat,
      value: sum,
    };
  }).filter((item) => item.value > 0);

  // prepare bar chart data (by week) — group expenses by week
  const weeklyData: Record<string, number> = {};
  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weeklyData[weekLabel] = (weeklyData[weekLabel] || 0) + exp.amount;
  });

  const barData = Object.entries(weeklyData).map(([week, amount]) => ({
    name: week,
    amount: parseFloat(amount.toFixed(2)),
  }));

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#9E9E9E'];

  return (
    <section className="space-y-6" aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="text-lg font-semibold text-gray-900">
        Overview
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Total Spent" value={formatCurrency(total)} />
        <StatsCard label="Average Expense" value={formatCurrency(average)} />
        <StatsCard label="Number of Expenses" value={count.toString()} />
      </div>

      {categoryData.length > 0 && (
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          <div className="w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value as number)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {barData.length > 0 && (
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Spending</h3>
          <div className="w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))
                  }
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}
