'use client';
import { useState, useEffect } from 'react';
import { summarizeFinancials } from '@/actions/summarize';
import { processFinancialData } from '@/utils/dataProcessor';

export default function AiSummary({ companyFacts, entityName }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Basic validation to prevent unnecessary runs
    if (!companyFacts || !entityName) return;

    const getAiInsight = async () => {
      setLoading(true);
      try {
        // CRITICAL: Ensure you are accessing the ['us-gaap'] property
        // Apple and Amazon data lives inside companyFacts['us-gaap']
        const factsSource = companyFacts?.['us-gaap'] || companyFacts;
        
        // 2. Use your robust utility to find the real data (handles fuzzy tags like SalesRevenueNet)
        const processed = processFinancialData(factsSource);

        // 3. Handle the 'Empty State' locally before calling the AI
        if (processed.revenue.length === 0 && processed.assets.length === 0) {
          // If still empty, log the keys to your console to see what the SEC sent
          console.log("Available SEC Tags:", Object.keys(factsSource).slice(0, 10));
          setSummary("No sufficient financial data found for this period.");
          setLoading(false);
          return;
        }

        // 4. Build the lightweight payload for the Gemini Server Action
        const lightweightData = {
          entityName,
          facts: {
            revenue: processed.revenue,
            assets: processed.assets,
          },
        };

        // 5. Call the Server Action
        const result = await summarizeFinancials(lightweightData);
        setSummary(result || "AI summary currently unavailable.");
        
      } catch (err) {
        console.error("AI Summary UI Error:", err);
        setSummary("AI Insight temporarily unavailable. Please refer to the charts below.");
      } finally {
        setLoading(false);
      }
    };

    getAiInsight();
  }, [companyFacts, entityName]);

  // If no data is passed at all, don't render the box
  if (!companyFacts) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm mb-8">
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
        <p className="text-gray-800 leading-relaxed italic whitespace-pre-line">
          {summary}
        </p>
      )}
    </div>
  );
}