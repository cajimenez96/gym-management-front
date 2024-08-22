import { createFileRoute } from '@tanstack/react-router';
import { MembersPage } from '@/members';

export const Route = createFileRoute('/_auth/_auth/members')({
  component: MembersPage,
});
