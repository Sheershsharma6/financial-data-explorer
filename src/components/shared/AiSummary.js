'use client';
import { useState, useEffect } from 'react';
import { summarizeFinancials } from '@/actions/summarize';

export default function AiSummary({ companyFacts, entityName }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!companyFacts || !entityName) return;

    const getAiInsight = async () => {
      setLoading(true);
      try {
        // Build lightweight data with only last 5 entries
        const sliceItems = (concept) => {
          const items = companyFacts?.[concept]?.units?.USD || [];
          return items
            .filter((item) => item.form === '10-K')
            .slice(-5)
            .map(({ end, val, form }) => ({ end, val, form }));
        };

        const lightweightData = {
          entityName,
          facts: {
            Assets: sliceItems('Assets'),
            Revenues: sliceItems('Revenues'),
          },
        };

        // Pass the lightweight data to the Server Action
        const result = await summarizeFinancials(lightweightData);
        setSummary(result || "AI summary unavailable.");
      } catch (err) {
        console.error("AI Summary error:", err);
        setSummary("AI Insight temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };

    getAiInsight();
  }, [companyFacts, entityName]);

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✨</span>
        <h3 className="text-blue-900 font-bold text-lg">AI Financial Insight</h3>
      </div>
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          <div className="h-4 bg-blue-200 rounded w-2/3"></div>
        </div>
      ) : (
        <p className="text-gray-800 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}