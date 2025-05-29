import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { Layout } from '@/components';
import { useAuthStore } from '@/stores/auth.store';
import { CircularProgress, Box } from '@mui/material';

function FullPageLoader() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}

const awaitAuthInitialization = (): Promise<void> => {
  return new Promise((resolve) => {
    const initialIsLoading = useAuthStore.getState().isLoading;

    if (!initialIsLoading) {
      resolve();
      return;
    }

    const unsubscribe = useAuthStore.subscribe(
      (state) => {
        if (!state.isLoading) { 
          unsubscribe();
          resolve();
        }
      }
    );
    
    if (!useAuthStore.getState().isLoading) {
        unsubscribe();
        resolve();
    }
  });
};

export const Route = createFileRoute('/_auth/_auth')({
  beforeLoad: async ({ location }) => {
    await awaitAuthInitialization();

    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
        replace: true,
      });
    }
  },
  component: LayoutComponent,
  pendingComponent: FullPageLoader,
});

function LayoutComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
