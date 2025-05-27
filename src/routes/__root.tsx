import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { useAuth } from 'src/context';
import { QueryClient } from '@tanstack/react-query';
import React, { Suspense } from 'react';

type AuthContextType = ReturnType<typeof useAuth>;

export interface RouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
  pendingComponent: () => <div>Cargando...</div>,
});
