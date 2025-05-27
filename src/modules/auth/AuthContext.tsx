import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { AuthService } from './auth.service';
import type { AuthState, AuthContextType, LoginRequest, User } from './auth.types';

// Initial state
const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: true,
	error: null,
};

// Action types
type AuthAction =
	| { type: 'AUTH_LOADING' }
	| { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
	| { type: 'AUTH_ERROR'; payload: string }
	| { type: 'AUTH_LOGOUT' }
	| { type: 'CLEAR_ERROR' };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
	switch (action.type) {
		case 'AUTH_LOADING':
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case 'AUTH_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};
		case 'AUTH_ERROR':
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: action.payload,
			};
		case 'AUTH_LOGOUT':
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			};
		case 'CLEAR_ERROR':
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Initialize auth on mount
	useEffect(() => {
		dispatch({ type: 'AUTH_LOADING' }); // Ensure loading state is true during async check
		const initAuth = async () => {
			try {
				const { user, token } = await AuthService.initializeAuth(); // Await the async initializeAuth
				
				if (user && token) {
					dispatch({ 
						type: 'AUTH_SUCCESS', 
						payload: { user, token } 
					});
				} else {
					dispatch({ type: 'AUTH_LOGOUT' });
				}
			} catch (error) {
				console.error('Failed to initialize auth routine:', error); // More specific error message
				dispatch({ type: 'AUTH_LOGOUT' }); // Ensure loading is set to false
			}
		};

		initAuth();
	}, []);

	// Login function
	const login = async (credentials: LoginRequest): Promise<void> => {
		dispatch({ type: 'AUTH_LOADING' });
		
		try {
			const response = await AuthService.login(credentials);
			
			console.log('🎯 Login successful:', {
				username: response.user.username,
				role: response.user.role
			});
			
			// Store token and user
			AuthService.setToken(response.token);
			AuthService.setStoredUser(response.user);
			
			dispatch({ 
				type: 'AUTH_SUCCESS', 
				payload: { 
					user: response.user, 
					token: response.token 
				} 
			});
			
			console.log('✅ Auth state updated successfully');
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
			dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
			throw error;
		}
	};

	// Logout function
	const logout = async (): Promise<void> => {
		try {
			await AuthService.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			AuthService.clearAuth();
			dispatch({ type: 'AUTH_LOGOUT' });
		}
	};

	// Clear error function
	const clearError = (): void => {
		dispatch({ type: 'CLEAR_ERROR' });
	};

	const contextValue: AuthContextType = {
		...state,
		login,
		logout,
		clearError,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth debe ser usado dentro de un AuthProvider');
	}
	return context;
} 