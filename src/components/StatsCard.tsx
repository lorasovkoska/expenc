'use client';

interface StatsCardProps {
  label: string;
  value: string;
  icon?: string;
}

export function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
