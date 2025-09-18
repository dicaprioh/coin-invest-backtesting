import React from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Analytics,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

import { RootState } from '@store/index'

const Dashboard: React.FC = () => {
  const { totalValue, totalPnl, totalPnlPercent, assets } = useSelector(
    (state: RootState) => state.portfolio
  )

  const statsCards = [
    {
      title: '총 포트폴리오 가치',
      value: `₩${totalValue.toLocaleString()}`,
      icon: <AccountBalance />,
      color: 'primary',
    },
    {
      title: '총 손익',
      value: `₩${totalPnl.toLocaleString()}`,
      icon: totalPnl >= 0 ? <TrendingUp /> : <TrendingDown />,
      color: totalPnl >= 0 ? 'success' : 'error',
      subtitle: `${totalPnlPercent >= 0 ? '+' : ''}${totalPnlPercent.toFixed(2)}%`,
    },
    {
      title: '보유 자산 수',
      value: assets.length.toString(),
      icon: <Analytics />,
      color: 'info',
    },
    {
      title: '최고 수익률 자산',
      value: assets.length > 0 
        ? assets.reduce((max, asset) => asset.pnlPercent > max.pnlPercent ? asset : max, assets[0])?.symbol || '-'
        : '-',
      icon: <TrendingUp />,
      color: 'success',
    },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        포트폴리오 현황과 주요 지표를 한눈에 확인하세요.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stat.value}
                    </Typography>
                    {stat.subtitle && (
                      <Chip
                        label={stat.subtitle}
                        size="small"
                        color={stat.color as any}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <Box color={`${stat.color}.main`}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Portfolio Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              포트폴리오 구성
            </Typography>
            {assets.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  아직 보유 중인 자산이 없습니다.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  포트폴리오 페이지에서 자산을 추가해보세요.
                </Typography>
              </Box>
            ) : (
              <Box>
                {assets.map((asset, index) => (
                  <Box key={asset.symbol} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body1" fontWeight="medium">
                        {asset.symbol}
                      </Typography>
                      <Box textAlign="right">
                        <Typography variant="body2">
                          ₩{asset.value.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={asset.pnlPercent >= 0 ? 'success.main' : 'error.main'}
                        >
                          {asset.pnlPercent >= 0 ? '+' : ''}{asset.pnlPercent.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={asset.allocation}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      포트폴리오 비중: {asset.allocation.toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              최근 활동
            </Typography>
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                최근 백테스팅 결과나 거래 내역이 여기에 표시됩니다.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard