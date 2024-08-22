import { createFileRoute } from '@tanstack/react-router';
import { CheckInPage } from '@/check-in';

export const Route = createFileRoute('/_auth/_auth/check-in')({
  component: CheckInPage,
});
