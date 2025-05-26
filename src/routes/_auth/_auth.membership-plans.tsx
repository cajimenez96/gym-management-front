import { createFileRoute, redirect } from '@tanstack/react-router';
import { MembershipPlansPage } from '@/modules/membership-plan';

export const Route = createFileRoute('/_auth/_auth/membership-plans')({
  beforeLoad: ({ context }) => {
    // Only owner can manage membership plans
    if (context.auth.user?.role !== 'owner') {
      throw redirect({ to: '/members' }); // Redirect admin to dashboard
    }
  },
  component: MembershipPlansPage,
});
