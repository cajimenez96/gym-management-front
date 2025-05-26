import { createFileRoute, redirect } from '@tanstack/react-router';
import { PaymentsPage } from '@/modules/payment';

export const Route = createFileRoute('/_auth/_auth/payment')({
  beforeLoad: ({ context }) => {
    // Only owner can process payments
    if (context.auth.user?.role !== 'owner') {
      throw redirect({ to: '/members' }); // Redirect admin to dashboard
    }
  },
  component: PaymentsPage,
});
