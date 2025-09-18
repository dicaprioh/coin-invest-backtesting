import React from 'react'
import { Typography, Box, Paper } from '@mui/material'

const Strategy: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        전략
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          전략 관리 기능이 여기에 구현됩니다.
        </Typography>
      </Paper>
    </Box>
  )
}

export default Strategy