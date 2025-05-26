import { createFileRoute, redirect } from '@tanstack/react-router';
import { PaymentHistoryPage } from '@/modules/payment';

export const Route = createFileRoute('/_auth/_auth/payment-history')({
  beforeLoad: ({ context }) => {
    // Only owner can view payment history
    if (context.auth.user?.role !== 'owner') {
      throw redirect({ to: '/members' }); // Redirect admin to dashboard
    }
  },
  component: PaymentHistoryPage,
});
