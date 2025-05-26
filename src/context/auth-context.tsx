// Re-exporting from the new auth module for backward compatibility
export { AuthProvider, useAuth } from '@/modules/auth/AuthContext';
export type { AuthContextType as AuthContext, User } from '@/modules/auth/auth.types';
