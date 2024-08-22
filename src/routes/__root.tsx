import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useAuth } from '@/ui/context';
import { QueryClient } from '@tanstack/react-query';

type AuthContextType = ReturnType<typeof useAuth>;

export interface RouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  pendingComponent: () => <div>Loading...</div>,
});
