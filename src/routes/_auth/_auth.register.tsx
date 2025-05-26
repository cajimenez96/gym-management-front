import { createFileRoute, redirect } from '@tanstack/react-router';
import { RegisterPage } from '@/modules/member';

export const Route = createFileRoute('/_auth/_auth/register')({
  beforeLoad: ({ context }) => {
    // Only owner can register members
    if (context.auth.user?.role !== 'owner') {
      throw redirect({ to: '/members' }); // Redirect admin to dashboard
    }
  },
  component: RegisterPage,
});
