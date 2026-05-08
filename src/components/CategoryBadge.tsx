'use client';

import { Category } from '@/types/expense';

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  // map categories to colors - keeps everything consistent
  const colorMap: Record<Category, { bg: string; text: string }> = {
    Food: { bg: 'bg-orange-100', text: 'text-orange-800' },
    Transport: { bg: 'bg-blue-100', text: 'text-blue-800' },
    Entertainment: { bg: 'bg-purple-100', text: 'text-purple-800' },
    Utilities: { bg: 'bg-green-100', text: 'text-green-800' },
    Health: { bg: 'bg-red-100', text: 'text-red-800' },
    Other: { bg: 'bg-gray-100', text: 'text-gray-800' },
  };

  const colors = colorMap[category];

  return (
    <span
      className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-sm font-medium`}
      role="status"
      aria-label={`Category: ${category}`}
    >
      {category}
    </span>
  );
}
