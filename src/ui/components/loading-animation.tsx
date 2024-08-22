import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export const LoadingAnimation = () => (
  <Box
    data-testid="loading-animation"
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);
