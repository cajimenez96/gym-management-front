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
	static async initializeAuth(): Promise<{ user: User | null; token: string | null }> {
		console.log('[AuthService.initializeAuth] Starting initialization...');
		const token = this.getToken();
		let user = this.getStoredUser(); 

		console.log('[AuthService.initializeAuth] Token from localStorage:', token);
		console.log('[AuthService.initializeAuth] User from localStorage:', user);

		if (token && user) {
			console.log('[AuthService.initializeAuth] Token and user found in localStorage. Attempting to validate token...');
			apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			console.log('[AuthService.initializeAuth] Authorization header set.');
			try {
				const freshUser = await this.getCurrentUser();
				console.log('[AuthService.initializeAuth] getCurrentUser successful. Fresh user:', freshUser);
				this.setStoredUser(freshUser); 
				console.log('[AuthService.initializeAuth] Stored fresh user in localStorage.');
				return { user: freshUser, token };
			} catch (error) {
				console.error('[AuthService.initializeAuth] Token validation failed (getCurrentUser errored). Clearing auth.', error);
				this.clearAuth(); 
				return { user: null, token: null };
			}
		} else {
			console.log('[AuthService.initializeAuth] No token or user found in localStorage. Returning nulls.');
			return { user: null, token: null };
		}
	}

	// Clear all auth data
	static clearAuth(): void {
		this.removeToken();
		this.removeStoredUser();
	}
} 