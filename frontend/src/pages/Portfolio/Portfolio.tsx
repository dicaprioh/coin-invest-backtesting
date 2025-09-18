import React from 'react'
import { Typography, Box, Paper } from '@mui/material'

const Portfolio: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        포트폴리오
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          포트폴리오 관리 기능이 여기에 구현됩니다.
        </Typography>
      </Paper>
    </Box>
  )
}

export default Portfolio