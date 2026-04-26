// src/components/charts/RevenueChart.js
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const RevenueChart = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="fp" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="val" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);