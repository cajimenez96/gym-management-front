import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { Layout } from '@/ui/components/layout.tsx';

export const Route = createFileRoute('/_auth/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
