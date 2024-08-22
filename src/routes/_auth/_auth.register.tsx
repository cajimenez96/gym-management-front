import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/member/register.page.tsx';

export const Route = createFileRoute('/_auth/_auth/register')({
  component: RegisterPage,
});
