import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/modules/auth';
import { useAuthStore } from '@/stores/auth.store';
import { z } from 'zod';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ search }) => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: search.redirect || '/members' });
    }
  },
  component: LoginPage,
});
