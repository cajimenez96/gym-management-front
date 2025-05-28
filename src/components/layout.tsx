import { ReactNode, useState } from 'react';
import {
  Box,
  CssBaseline,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Sidenav } from '@/components/index.ts';
import { useNotificationStore } from '@/stores/notification.store';

export function Layout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    open: snackbarOpen,
    message: snackbarMessage,
    severity: snackbarSeverity,
    autoHideDuration: snackbarAutoHideDuration,
    hideSnackbar,
  } = useNotificationStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSnackbarClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      {isMobile ? (
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="abrir menú"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              Gestión de Gimnasio
            </Typography>
          </Toolbar>
        </AppBar>
      ) : null}
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
          mt: isMobile ? '64px' : 0, // Add top margin for mobile to account for AppBar height
        }}
      >
        {children}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarAutoHideDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
