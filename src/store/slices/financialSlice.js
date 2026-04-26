import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCompanyFacts } from '@/services/secApi';

export const fetchCompanyData = createAsyncThunk(
  'financials/fetchCompanyData',
  async (cik, { rejectWithValue }) => {
    try {
      const data = await getCompanyFacts(cik);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  companyFacts: null,
  loading: false,
  error: null,
  searchTerm: '',
};

const financialSlice = createSlice({
  name: 'financials',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.companyFacts = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.loading = false;
        state.companyFacts = action.payload;
      })
      .addCase(fetchCompanyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, setSearchTerm } = financialSlice.actions;
export default financialSlice.reducer;