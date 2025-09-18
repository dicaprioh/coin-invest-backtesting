import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import authSlice from './slices/authSlice'
import portfolioSlice from './slices/portfolioSlice'
import marketSlice from './slices/marketSlice'
import backtestingSlice from './slices/backtestingSlice'
import uiSlice from './slices/uiSlice'
import { apiSlice } from './api/apiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    portfolio: portfolioSlice,
    market: marketSlice,
    backtesting: backtestingSlice,
    ui: uiSlice,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store