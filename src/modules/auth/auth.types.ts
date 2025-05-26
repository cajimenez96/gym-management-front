export interface User {
	id: string;
	username: string;
	role: 'owner' | 'admin';
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	user: User;
	token: string;
	message: string;
}

export interface AuthError {
	error: string;
	message: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface AuthContextType extends AuthState {
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => void;
	clearError: () => void;
} 