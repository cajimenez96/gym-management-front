import { apiClient } from '@/api-client';
import type { LoginRequest, LoginResponse, User } from './auth.types';

export class AuthService {
	private static readonly TOKEN_KEY = 'gym_auth_token';
	private static readonly USER_KEY = 'gym_auth_user';

	// API Calls
	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
		return response.data;
	}

	static async logout(): Promise<void> {
		await apiClient.post('/auth/logout');
	}

	static async getCurrentUser(): Promise<User> {
		const response = await apiClient.get<User>('/auth/me');
		return response.data;
	}

	// Token Management
	static getToken(): string | null {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	static setToken(token: string): void {
		localStorage.setItem(this.TOKEN_KEY, token);
		// Set authorization header for future requests
		apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}

	static removeToken(): void {
		localStorage.removeItem(this.TOKEN_KEY);
		delete apiClient.defaults.headers.common['Authorization'];
	}

	// User Management
	static getStoredUser(): User | null {
		const userString = localStorage.getItem(this.USER_KEY);
		if (!userString) return null;
		
		try {
			return JSON.parse(userString);
		} catch {
			return null;
		}
	}

	static setStoredUser(user: User): void {
		localStorage.setItem(this.USER_KEY, JSON.stringify(user));
	}

	static removeStoredUser(): void {
		localStorage.removeItem(this.USER_KEY);
	}

	// Initialize auth on app start
	static initializeAuth(): { user: User | null; token: string | null } {
		const token = this.getToken();
		const user = this.getStoredUser();

		if (token && user) {
			// Set authorization header
			apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			return { user, token };
		}

		return { user: null, token: null };
	}

	// Clear all auth data
	static clearAuth(): void {
		this.removeToken();
		this.removeStoredUser();
	}
} 