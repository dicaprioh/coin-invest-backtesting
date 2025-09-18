import React from 'react'
import { Typography, Box, Paper } from '@mui/material'

const Backtesting: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        백테스팅
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          백테스팅 기능이 여기에 구현됩니다.
        </Typography>
      </Paper>
    </Box>
  )
}

export default Backtesting