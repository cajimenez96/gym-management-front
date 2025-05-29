// src/stores/auth.store.ts
import { create } from 'zustand';
import { AuthService } from '@/modules/auth/auth.service'; 
import type { User, LoginRequest } from '@/modules/auth/auth.types'; 

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true for initial auth check
  error: null,
  
  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const { user, token } = await AuthService.initializeAuth();
      if (user && token) {
        set({ user, token, isAuthenticated: true, isLoading: false, error: null });
      } else {
        AuthService.clearAuth(); 
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
      }
    } catch (error) {
      AuthService.clearAuth();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: 'Failed to initialize' });
    }
  },

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.login(credentials);
      AuthService.setToken(response.token);
      AuthService.setStoredUser(response.user);
      set({ 
        user: response.user, 
        token: response.token, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: errorMessage });
      throw error; // Re-lanzar para que el componente de login pueda manejarlo si es necesario
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout(); // Llama a la API para invalidar el token en el backend
    } catch (error) {
      console.error('Error during API logout:', error);
      // Se podría mostrar un error al usuario aquí si la invalidación del token del backend falla,
      // pero la limpieza local se hará de todas formas en el finally.
    } finally {
      AuthService.clearAuth(); // Limpia localStorage y cabeceras de apiClient
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Respecto a la inicialización:
// En lugar de llamar a useAuthStore.getState().initializeAuth() aquí globalmente,
// es más limpio y predecible llamarlo explícitamente una vez en el punto de entrada 
// principal de la aplicación (ej. main.tsx) ANTES de que la app se renderice.
// Esto evita posibles condiciones de carrera o ejecuciones múltiples si este archivo
// es importado en varios lugares de forma no controlada durante el árbol de dependencias. 