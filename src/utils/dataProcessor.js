/**
 * Robustly extracts financial trends by checking multiple common SEC tags.
 */
export const processFinancialData = (facts) => {
  if (!facts) return [];

  // Common tags for 'Revenue' in order of preference
  const revenueTags = [
    'Revenues', 
    'SalesRevenueNet', 
    'RevenueFromContractWithCustomerExcludingAssessedTax',
    'TotalRevenuesAndOtherIncome'
  ];

  // Common tags for 'Assets'
  const assetTags = ['Assets', 'TotalAssets'];

  // Helper to find the first tag that actually has data
  const findValidData = (tags) => {
    for (const tag of tags) {
      if (facts[tag]?.units?.USD) return facts[tag].units.USD;
    }
    return null;
  };

  const rawRevenue = findValidData(revenueTags) || [];
  const rawAssets = findValidData(assetTags) || [];

  // Transform data for the charts (filtering for Annual 10-K filings)
  const processItems = (data) => data
    .filter(item => item.form === '10-K')
    .map(item => ({
      year: new Date(item.end).getFullYear(),
      val: item.val,
    }))
    .sort((a, b) => a.year - b.year)
    .filter((v, i, a) => a.findIndex(t => t.year === v.year) === i) // Deduplicate
    .slice(-5); // Get last 5 years

  return {
    revenue: processItems(rawRevenue),
    assets: processItems(rawAssets)
  };
};