import { useAuth } from './AuthContext';
import type { User } from './auth.types';

type UserRole = User['role'];

export function useRoleAccess() {
	const { user, isAuthenticated } = useAuth();

	const hasRole = (requiredRole: UserRole): boolean => {
		return isAuthenticated && user?.role === requiredRole;
	};

	const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
		return isAuthenticated && user?.role ? requiredRoles.includes(user.role) : false;
	};

	const isOwner = (): boolean => {
		return hasRole('owner');
	};

	const isAdmin = (): boolean => {
		return hasRole('admin');
	};

	const canAccessMembers = (): boolean => {
		return hasAnyRole(['owner', 'admin']); // Both can view members
	};

	const canManageMembers = (): boolean => {
		return isOwner(); // Only owner can create/edit/delete members
	};

	const canAccessPayments = (): boolean => {
		return isOwner(); // Only owner handles payments
	};

	const canAccessPlans = (): boolean => {
		return isOwner(); // Only owner manages membership plans
	};

	const canAccessCheckIns = (): boolean => {
		return hasAnyRole(['owner', 'admin']); // Both can do check-ins
	};

	return {
		user,
		isAuthenticated,
		hasRole,
		hasAnyRole,
		isOwner,
		isAdmin,
		canAccessMembers,
		canManageMembers,
		canAccessPayments,
		canAccessPlans,
		canAccessCheckIns,
	};
} 