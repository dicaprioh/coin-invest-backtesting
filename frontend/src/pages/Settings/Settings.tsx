import React from 'react'
import { Typography, Box, Paper } from '@mui/material'

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        설정
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          설정 기능이 여기에 구현됩니다.
        </Typography>
      </Paper>
    </Box>
  )
}

export default Settings