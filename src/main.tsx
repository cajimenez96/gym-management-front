import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, ThemeProvider } from '@mui/material';
import { useAuthStore } from '@/stores/auth.store';

export const queryClient = new QueryClient();
const theme = createTheme();

// Initialize the auth store state before any rendering happens
useAuthStore.getState().initializeAuth();

// Define a placeholder for the auth context part of the router context
// to satisfy the existing type signature that routeTree.gen.ts might expect.
// The actual auth logic is now handled by useAuthStore.getState() in route guards.
const placeholderAuthContext = {
  user: null,
  token: null,
  isAuthenticated: useAuthStore.getState().isAuthenticated, // Reflect initial state
  isLoading: useAuthStore.getState().isLoading,
  error: null,
  login: async () => { console.warn('Router context login called'); },
  logout: async () => { console.warn('Router context logout called'); },
  clearError: () => { console.warn('Router context clearError called'); },
  // Add any other functions/properties that were on the original AuthContextType
  // if the linter still complains about missing properties on `auth`.
  initializeAuth: useAuthStore.getState().initializeAuth,
};

// The context type will be inferred by TanStack Router based on the provided context object.
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: placeholderAuthContext, // Provide the placeholder auth context
  },
  // defaultPreload: 'intent',
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
    // If RouterContext is explicitly typed somewhere (e.g. in routeTree.gen.ts or a global types file)
    // ensure this matches or update that type definition.
    // For now, we assume it will infer from the provided context object.
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
