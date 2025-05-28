import { createFileRoute, redirect } from '@tanstack/react-router';
import { MembershipPlansPage } from '@/modules/membership-plan';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/_auth/_auth/membership-plans')({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    // Only owner can manage membership plans
    if (!isAuthenticated || user?.role !== 'owner') {
      throw redirect({ to: '/check-in' }); // Redirigir a check-in si no es owner
    }
  },
  component: MembershipPlansPage,
});
