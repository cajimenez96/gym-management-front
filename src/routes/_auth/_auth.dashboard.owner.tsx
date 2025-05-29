import { createFileRoute } from '@tanstack/react-router';
import { OwnerDashboard } from '@/modules/dashboard';
import { useRoleAccess } from '@/modules/auth';

export const Route = createFileRoute('/_auth/_auth/dashboard/owner')({
  beforeLoad: () => {
    // Verify user is authenticated (handled by _auth layout)
    // Additional role verification will be done in component
  },
  component: OwnerDashboardPage,
});

function OwnerDashboardPage() {
  const { isOwner } = useRoleAccess();

  if (!isOwner()) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Acceso Denegado</h2>
        <p>Necesitas privilegios de propietario para acceder a este panel.</p>
      </div>
    );
  }

  return <OwnerDashboard />;
} 