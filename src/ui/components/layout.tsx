import { ReactNode, useState } from 'react';
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { Sidenav } from '@/ui/components';

export function Layout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidenav
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'auto',
          width: '100%',
        }}
      >
        <CssBaseline />
        {children}
      </Box>
    </Box>
  );
}
