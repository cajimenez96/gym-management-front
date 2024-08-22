import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_auth/payment-history')({
  component: () => <div>Hello /payment-history!</div>
})