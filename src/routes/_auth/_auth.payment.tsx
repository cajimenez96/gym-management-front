import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_auth/payment')({
  component: () => <div>Hello /payment!</div>,
});
