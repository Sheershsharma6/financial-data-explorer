import axios from 'axios';

export const getCompanyFacts = async (cik) => {
  try {
    console.log("Fetching SEC facts for CIK:", cik);
    const response = await axios.get(`/api/sec?cik=${cik}`);
    console.log("SEC API response received");
    return response.data;
  } catch (error) {
    console.error("SEC API Error:", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error.response?.data?.error || error?.message || 'Server error fetching financial data';
  }
};