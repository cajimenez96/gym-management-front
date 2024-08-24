import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render } from '@testing-library/react';
import { AuthProvider, SnackbarProvider } from '@/context';
import React from 'react';

export const MEMBERS_MATCHER = '*/members';
export const MEMBERSHIP_PLANS_MATCHER = '*/membership-plans';
export const CHECK_INS_MATCHER = '*/check-ins';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = createTheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}
