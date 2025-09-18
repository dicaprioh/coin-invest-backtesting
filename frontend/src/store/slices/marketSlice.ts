import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MarketData {
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  lastUpdate: number
}

interface MarketState {
  marketData: Record<string, MarketData>
  watchlist: string[]
  selectedSymbol: string | null
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  loading: boolean
  error: string | null
}

const initialState: MarketState = {
  marketData: {},
  watchlist: ['BTC-USDT', 'ETH-USDT', 'ADA-USDT', 'DOT-USDT'],
  selectedSymbol: null,
  timeframe: '1h',
  loading: false,
  error: null,
}

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarketData: (state, action: PayloadAction<Record<string, MarketData>>) => {
      state.marketData = { ...state.marketData, ...action.payload }
    },
    updateMarketData: (state, action: PayloadAction<MarketData>) => {
      state.marketData[action.payload.symbol] = action.payload
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload)
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(symbol => symbol !== action.payload)
    },
    setSelectedSymbol: (state, action: PayloadAction<string | null>) => {
      state.selectedSymbol = action.payload
    },
    setTimeframe: (state, action: PayloadAction<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>) => {
      state.timeframe = action.payload
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
  setMarketData,
  updateMarketData,
  addToWatchlist,
  removeFromWatchlist,
  setSelectedSymbol,
  setTimeframe,
  setLoading,
  setError,
} = marketSlice.actions

export default marketSlice.reducer