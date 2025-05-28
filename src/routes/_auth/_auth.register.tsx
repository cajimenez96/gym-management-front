import { createFileRoute, redirect } from '@tanstack/react-router';
import { RegisterPage } from '@/modules/member';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/_auth/_auth/register')({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    // Only owner can register members
    if (!isAuthenticated || user?.role !== 'owner') {
      throw redirect({ to: '/check-in' }); // Redirigir a check-in si no es owner
    }
  },
  component: RegisterPage,
});
