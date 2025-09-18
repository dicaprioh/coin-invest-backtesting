import React from 'react'
import { Typography, Box, Paper } from '@mui/material'

const Markets: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        마켓
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          마켓 데이터 기능이 여기에 구현됩니다.
        </Typography>
      </Paper>
    </Box>
  )
}

export default Markets