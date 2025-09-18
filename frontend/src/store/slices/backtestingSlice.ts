import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BacktestConfig {
  symbol: string
  startDate: string
  endDate: string
  initialCapital: number
  strategy: string
  parameters: Record<string, any>
}

interface BacktestResult {
  id: string
  config: BacktestConfig
  results: {
    totalReturn: number
    totalReturnPercent: number
    annualizedReturn: number
    maxDrawdown: number
    sharpeRatio: number
    winRate: number
    totalTrades: number
    profitFactor: number
    equity: Array<{ date: string; value: number }>
    trades: Array<{
      entryDate: string
      exitDate: string
      symbol: string
      side: 'buy' | 'sell'
      quantity: number
      entryPrice: number
      exitPrice: number
      pnl: number
      pnlPercent: number
    }>
  }
  status: 'running' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  error?: string
}

interface BacktestingState {
  currentBacktest: BacktestResult | null
  backtestHistory: BacktestResult[]
  config: BacktestConfig
  loading: boolean
  error: string | null
}

const initialState: BacktestingState = {
  currentBacktest: null,
  backtestHistory: [],
  config: {
    symbol: 'BTC-USDT',
    startDate: '',
    endDate: '',
    initialCapital: 10000,
    strategy: 'buy_and_hold',
    parameters: {},
  },
  loading: false,
  error: null,
}

const backtestingSlice = createSlice({
  name: 'backtesting',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Partial<BacktestConfig>>) => {
      state.config = { ...state.config, ...action.payload }
    },
    setCurrentBacktest: (state, action: PayloadAction<BacktestResult | null>) => {
      state.currentBacktest = action.payload
    },
    addBacktestResult: (state, action: PayloadAction<BacktestResult>) => {
      const existingIndex = state.backtestHistory.findIndex(bt => bt.id === action.payload.id)
      if (existingIndex !== -1) {
        state.backtestHistory[existingIndex] = action.payload
      } else {
        state.backtestHistory.unshift(action.payload)
      }
    },
    setBacktestHistory: (state, action: PayloadAction<BacktestResult[]>) => {
      state.backtestHistory = action.payload
    },
    removeBacktestResult: (state, action: PayloadAction<string>) => {
      state.backtestHistory = state.backtestHistory.filter(bt => bt.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setConfig,
  setCurrentBacktest,
  addBacktestResult,
  setBacktestHistory,
  removeBacktestResult,
  setLoading,
  setError,
} = backtestingSlice.actions

export default backtestingSlice.reducer