import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material'
import {
  Security,
  TrendingUp,
  Analytics,
  Speed,
} from '@mui/icons-material'

const features = [
  {
    icon: <Security fontSize="large" />,
    title: '안전한 보안',
    description: '최고 수준의 보안으로 개인정보와 투자 데이터를 보호합니다.',
  },
  {
    icon: <TrendingUp fontSize="large" />,
    title: '실시간 데이터',
    description: '실시간 암호화폐 시장 데이터로 정확한 백테스팅을 제공합니다.',
  },
  {
    icon: <Analytics fontSize="large" />,
    title: '고급 분석',
    description: '다양한 기술 지표와 분석 도구로 전략을 검증합니다.',
  },
  {
    icon: <Speed fontSize="large" />,
    title: '빠른 성능',
    description: '최적화된 백테스팅 엔진으로 빠른 결과를 제공합니다.',
  },
]

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/dashboard',
      },
    })
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            backgroundColor: 'transparent',
            mb: 6,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            암호화폐 투자 백테스팅 플랫폼
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            데이터 기반의 투자 전략을 검증하고 최적화하세요
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '600px', mx: 'auto' }}>
            실제 시장 데이터를 활용한 정교한 백테스팅으로 투자 전략의 성과를 미리 확인하고,
            리스크를 최소화하면서 수익을 극대화할 수 있습니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ mt: 4, px: 6, py: 2, fontSize: '1.1rem' }}
          >
            시작하기
          </Button>
        </Paper>

        {/* Features Section */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box color="primary.main" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info */}
        <Paper sx={{ p: 4, mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            왜 백테스팅이 중요한가요?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            백테스팅은 과거 데이터를 바탕으로 투자 전략의 성과를 시뮬레이션하는 과정입니다.
            실제 투자 전에 전략의 수익성과 위험성을 평가할 수 있어,
            보다 안전하고 효과적인 투자 결정을 내릴 수 있습니다.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login