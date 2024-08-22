import { createFileRoute } from '@tanstack/react-router';
import { PaymentHistoryPage } from '@/modules/payment';

export const Route = createFileRoute('/_auth/_auth/payment-history')({
  component: PaymentHistoryPage,
});
