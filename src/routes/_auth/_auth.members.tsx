import { createFileRoute } from '@tanstack/react-router';
import { MembersPage } from '@/member';

export const Route = createFileRoute('/_auth/_auth/members')({
  component: MembersPage,
});
