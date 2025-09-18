import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, CircularProgress } from '@mui/material'

import Layout from '@components/Layout/Layout'
import ProtectedRoute from '@components/Auth/ProtectedRoute'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@pages/Dashboard/Dashboard'))
const Portfolio = React.lazy(() => import('@pages/Portfolio/Portfolio'))
const Backtesting = React.lazy(() => import('@pages/Backtesting/Backtesting'))
const Markets = React.lazy(() => import('@pages/Markets/Markets'))
const Strategy = React.lazy(() => import('@pages/Strategy/Strategy'))
const Settings = React.lazy(() => import('@pages/Settings/Settings'))
const Login = React.lazy(() => import('@pages/Auth/Login'))

const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="50vh"
  >
    <CircularProgress size={60} />
  </Box>
)

function App() {
  const { isLoading, error } = useAuth0()

  if (error) {
    return (
      <Box p={3}>
        <div>인증 오류: {error.message}</div>
      </Box>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/backtesting" element={<Backtesting />} />
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/strategy" element={<Strategy />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App