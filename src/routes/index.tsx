import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated, user } = context.auth;
    
    console.log('🔍 Root route - Auth check:', {
      isAuthenticated,
      user: user ? { username: user.username, role: user.role } : null
    });
    
    if (isAuthenticated && user) {
      console.log('✅ User authenticated, redirecting to /members');
      throw redirect({ to: '/members' });
    } else {
      console.log('❌ User not authenticated, redirecting to /login');
      throw redirect({ to: '/login' });
    }
  },
  component: () => null,
});
