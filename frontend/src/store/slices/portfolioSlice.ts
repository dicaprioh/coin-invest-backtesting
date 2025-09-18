import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Asset {
  symbol: string
  amount: number
  value: number
  allocation: number
  pnl: number
  pnlPercent: number
}

interface PortfolioState {
  assets: Asset[]
  totalValue: number
  totalPnl: number
  totalPnlPercent: number
  loading: boolean
  error: string | null
}

const initialState: PortfolioState = {
  assets: [],
  totalValue: 0,
  totalPnl: 0,
  totalPnlPercent: 0,
  loading: false,
  error: null,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolio: (state, action: PayloadAction<Asset[]>) => {
      state.assets = action.payload
      state.totalValue = action.payload.reduce((sum, asset) => sum + asset.value, 0)
      state.totalPnl = action.payload.reduce((sum, asset) => sum + asset.pnl, 0)
      state.totalPnlPercent = state.totalValue > 0 ? (state.totalPnl / state.totalValue) * 100 : 0
    },
    updateAsset: (state, action: PayloadAction<Asset>) => {
      const index = state.assets.findIndex(asset => asset.symbol === action.payload.symbol)
      if (index !== -1) {
        state.assets[index] = action.payload
      } else {
        state.assets.push(action.payload)
      }
      // Recalculate totals
      state.totalValue = state.assets.reduce((sum, asset) => sum + asset.value, 0)
      state.totalPnl = state.assets.reduce((sum, asset) => sum + asset.pnl, 0)
      state.totalPnlPercent = state.totalValue > 0 ? (state.totalPnl / state.totalValue) * 100 : 0
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(asset => asset.symbol !== action.payload)
      state.totalValue = state.assets.reduce((sum, asset) => sum + asset.value, 0)
      state.totalPnl = state.assets.reduce((sum, asset) => sum + asset.pnl, 0)
      state.totalPnlPercent = state.totalValue > 0 ? (state.totalPnl / state.totalValue) * 100 : 0
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setPortfolio, updateAsset, removeAsset, setLoading, setError } = portfolioSlice.actions
export default portfolioSlice.reducer