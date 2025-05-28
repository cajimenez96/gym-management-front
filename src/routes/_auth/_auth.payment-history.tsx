import { createFileRoute, redirect } from '@tanstack/react-router';
import { PaymentHistoryPage } from '@/modules/payment';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/_auth/_auth/payment-history')({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    // Only owner can view payment history
    if (!isAuthenticated || user?.role !== 'owner') {
      throw redirect({ to: '/check-in' }); // Redirigir a check-in si no es owner
    }
  },
  component: PaymentHistoryPage,
});
