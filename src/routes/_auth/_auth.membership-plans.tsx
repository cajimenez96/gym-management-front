import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_auth/membership-plans')({
  component: () => <div>Hello /membership-plans!</div>,
});
