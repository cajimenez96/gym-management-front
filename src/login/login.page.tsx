import React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '@/ui/hooks';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { sleep } from '@/utils.ts';

export function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();
  const { redirect } = useSearch({ strict: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await login('admin');
    await router.invalidate();
    // This is just a hack being used to wait for the auth state to update
    // in a real app, you'd want to use a more robust solution
    await sleep(1);
    await navigate({ to: redirect || '/members' });
    setIsLoggingIn(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Gym Management Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              InputProps={{ readOnly: true }}
              value={'admin'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={'password'}
              InputProps={{ readOnly: true }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoggingIn}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
