import { createFileRoute } from '@tanstack/react-router';
import { PaymentsPage } from '@/payment/payments.page.tsx';

export const Route = createFileRoute('/_auth/_auth/payment')({
  component: PaymentsPage,
});
