'use client';

export default function YearSelector({ startYear, endYear, onRangeChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-500 uppercase ml-1 mb-1">Start Year</label>
        <select 
          value={startYear} 
          onChange={(e) => onRangeChange(Number(e.target.value), endYear)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="h-8 w-[1px] bg-slate-200 mt-4" />

      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-500 uppercase ml-1 mb-1">End Year</label>
        <select 
          value={endYear} 
          onChange={(e) => onRangeChange(startYear, Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}