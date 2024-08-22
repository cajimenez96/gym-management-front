import { createFileRoute } from '@tanstack/react-router';
import { PaymentHistoryPage } from '@/payment-history/payment-history.page.tsx';

export const Route = createFileRoute('/_auth/_auth/payment-history')({
  component: PaymentHistoryPage,
});
