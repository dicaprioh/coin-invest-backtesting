import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Portfolio', 'Market', 'Backtest', 'User'],
  endpoints: (builder) => ({
    // Market data endpoints
    getMarketData: builder.query<any, { symbol: string; interval: string; start: string; end: string }>({
      query: ({ symbol, interval, start, end }) => 
        `/market/data?symbol=${symbol}&interval=${interval}&start=${start}&end=${end}`,
      providesTags: ['Market'],
    }),
    
    getSymbols: builder.query<string[], void>({
      query: () => '/market/symbols',
      providesTags: ['Market'],
    }),

    // Portfolio endpoints
    getPortfolio: builder.query<any, void>({
      query: () => '/portfolio',
      providesTags: ['Portfolio'],
    }),

    updatePortfolio: builder.mutation<any, any>({
      query: (portfolio) => ({
        url: '/portfolio',
        method: 'PUT',
        body: portfolio,
      }),
      invalidatesTags: ['Portfolio'],
    }),

    // Backtesting endpoints
    runBacktest: builder.mutation<any, any>({
      query: (config) => ({
        url: '/backtest/run',
        method: 'POST',
        body: config,
      }),
      invalidatesTags: ['Backtest'],
    }),

    getBacktestResults: builder.query<any, string>({
      query: (id) => `/backtest/results/${id}`,
      providesTags: ['Backtest'],
    }),

    getBacktestHistory: builder.query<any[], void>({
      query: () => '/backtest/history',
      providesTags: ['Backtest'],
    }),
  }),
})

export const {
  useGetMarketDataQuery,
  useGetSymbolsQuery,
  useGetPortfolioQuery,
  useUpdatePortfolioMutation,
  useRunBacktestMutation,
  useGetBacktestResultsQuery,
  useGetBacktestHistoryQuery,
} = apiSlice