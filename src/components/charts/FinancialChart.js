'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function FinancialChart({ data, title }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full h-[400px]">
      <h3 className="text-lg font-bold mb-6 text-gray-800">{title} (Billions USD)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis 
            stroke="#6b7280"
            tickFormatter={(value) => `$${(value / 1e9).toFixed(0)}B`}
          />
          <Tooltip 
            formatter={(value) => [`$${(value / 1e9).toFixed(2)}B`, 'Value']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}