'use client';

interface StatsCardProps {
  label: string;
  value: string;
  icon?: string;
}

export function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 shadow sm:p-4">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
