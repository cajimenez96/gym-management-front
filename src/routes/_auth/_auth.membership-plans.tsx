import { createFileRoute } from '@tanstack/react-router';
import { MembershipPlanPage } from '@/membership-plan/membership-plan.page.tsx';

export const Route = createFileRoute('/_auth/_auth/membership-plans')({
  component: MembershipPlanPage,
});
