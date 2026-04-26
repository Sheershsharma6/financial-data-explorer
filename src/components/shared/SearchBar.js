'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStart, fetchSuccess, fetchFailure } from '@/store/slices/financialSlice';
import { getCompanyFacts } from '@/services/secApi';
import { summarizeFinancials } from '@/actions/summarize';

export default function SearchBar() {
  const [cik, setCik] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.financials);

  const buildLightweightData = (companyData) => {
    const sliceItems = (concept) => {
      const items = companyData?.facts?.[concept]?.units?.USD || [];
      return items
        .filter((item) => item.form === '10-K')
        .slice(-5)
        .map(({ end, val, form }) => ({ end, val, form }));
    };

    return {
      entityName: companyData.entityName,
      facts: {
        Assets: sliceItems('Assets'),
        Revenues: sliceItems('Revenues'),
      },
    };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cik) return;

    dispatch(fetchStart());
    try {
      // 1. Fetch data from SEC
      const data = await getCompanyFacts(cik);
      const lightweightData = buildLightweightData(data);

      // 2. Fetch AI Summary using Server Action with reduced payload
      let aiSummary = "Unable to generate AI summary at this time. Please refer to the charts and tables below for detailed financial analysis.";
      try {
        const summary = await summarizeFinancials(lightweightData);
        aiSummary = summary;
      } catch (aiError) {
        console.error("Server Action Error details:", aiError);
      }

      dispatch(fetchSuccess({
        entityName: data.entityName,
        facts: data.facts['us-gaap'],
        summary: aiSummary,
      }));
    } catch (err) {
      console.error("Search error:", err);
      dispatch(fetchFailure(err?.message || err?.toString() || "Failed to fetch financial data"));
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md mx-auto my-8">
      <input
        type="text"
        placeholder="Enter 10-digit CIK (e.g., 0000320193)"
        className="flex-1 p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
        value={cik}
        onChange={(e) => setCik(e.target.value)}
      />
      <button
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Searching...' : 'Explore'}
      </button>
    </form>
  );
}