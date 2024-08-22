import { createFileRoute } from '@tanstack/react-router';
import { PaymentPage } from '@/payment/payment.page.tsx';

export const Route = createFileRoute('/_auth/_auth/payment')({
  component: PaymentPage,
});
