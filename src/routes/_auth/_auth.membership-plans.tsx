import { createFileRoute } from '@tanstack/react-router';
import { MembershipPlansPage } from '@/membership-plan';

export const Route = createFileRoute('/_auth/_auth/membership-plans')({
  component: MembershipPlansPage,
});
