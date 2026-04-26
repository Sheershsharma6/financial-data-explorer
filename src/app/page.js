'use client';
import { useSelector } from 'react-redux';
import { processFinancialData } from '@/utils/dataProcessor';
import FinancialChart from '@/components/charts/FinancialChart';
import DataTable from '@/components/shared/DataTable';
import { exportToCSV } from '@/utils/exportUtils';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCompanyData } from '@/store/slices/financialSlice';
import AiSummary from '@/components/shared/AiSummary';
export default function Home() {
  const { companyFacts, loading, error } = useSelector((state) => state.financials);

  const [cik, setCik] = useState('');
  const dispatch = useDispatch();
  
  // CRITICAL: Access the ['us-gaap'] property which contains the actual financial data
  const factsSource = companyFacts?.facts?.['us-gaap'] || companyFacts?.facts || {};
  const { revenue, assets } = companyFacts ? processFinancialData(factsSource) : { revenue: [], assets: [] };

  const handleSearch = () => {
    if (!cik) return;
    dispatch(fetchCompanyData(cik));
  };


  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Data Explorer</h1>
          <p className="text-gray-600">Fetch real-time SEC filings & AI-powered insights</p>
        </header>

        <div className="mb-4 flex gap-2 w-full max-w-md mx-auto">
          <input 
            value={cik} 
            onChange={(e) => setCik(e.target.value)} 
            placeholder="Enter CIK (e.g. 320193)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black" 
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Explore</button>
        </div>
         
        
        {/* Loading & Error States  */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Gathering financial facts...</p>
          </div>
        )}


        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Data Display Area */}
        {companyFacts && (
          <div className="mt-8 grid grid-cols-1 gap-6">
            <AiSummary 
            companyFacts={companyFacts.facts} 
            entityName={companyFacts.entityName} 
          />
            <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-900">{companyFacts.entityName}</h2>
                  <button 
                    onClick={() => exportToCSV(assets, `${companyFacts.entityName}_Financials.csv`)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    📥 Export CSV
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-6">Financial Metrics Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <FinancialChart data={assets} title="Total Assets Growth" />
                  <DataTable data={assets} />
                </div>
              </div>
            </section>
          </div>
        )}  
      </div>
  </main>
  );
} 