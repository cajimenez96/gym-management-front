import { createFileRoute } from '@tanstack/react-router';
import { PaymentsPage } from '@/payment';

export const Route = createFileRoute('/_auth/_auth/payment')({
  component: PaymentsPage,
});
