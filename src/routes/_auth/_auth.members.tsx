import { createFileRoute } from '@tanstack/react-router';
import { MembersPage } from '@/modules/member';

export const Route = createFileRoute('/_auth/_auth/members')({
  component: MembersPage,
});
