import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { 
	Box, 
	Button, 
	TextField, 
	Typography, 
	Alert,
	CircularProgress,
	Container,
	Paper,
	Avatar,
	InputAdornment,
	IconButton
} from '@mui/material';
import { 
	Person as PersonIcon, 
	Lock as LockIcon,
	Visibility,
	VisibilityOff,
	FitnessCenter as GymIcon
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginRequest } from './auth.types';

export function LoginPage() {
	const [credentials, setCredentials] = useState<LoginRequest>({
		username: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginRequest>>({});
	
	const login = useAuthStore(state => state.login);
	const isLoading = useAuthStore(state => state.isLoading);
	const authError = useAuthStore(state => state.error);
	const clearAuthError = useAuthStore(state => state.clearError);
	const navigate = useNavigate();

	React.useEffect(() => {
		clearAuthError();
	}, [clearAuthError]);

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginRequest> = {};

		if (!credentials.username.trim()) {
			newErrors.username = 'El nombre de usuario es requerido';
		}

		if (!credentials.password) {
			newErrors.password = 'La contraseña es requerida';
		} else if (credentials.password.length < 3) {
			newErrors.password = 'La contraseña debe tener al menos 3 caracteres';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearAuthError();

		if (!validateForm()) {
			return;
		}

		try {
			await login(credentials);
			// Small delay to ensure auth context updates before navigation
			setTimeout(() => {
				navigate({ to: '/' });
			}, 100);
		} catch (error) {
			// Error is handled by the AuthContext
			console.error('Login failed:', error);
		}
	};

	const handleInputChange = (field: keyof LoginRequest) => (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setCredentials(prev => ({
			...prev,
			[field]: e.target.value,
		}));
		
		// Clear field error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: undefined,
			}));
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(prev => !prev);
	};

	return (
		<Container component="main" maxWidth="sm">
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					py: 4,
				}}
			>
				<Paper 
					elevation={8} 
					sx={{ 
						p: 4, 
						width: '100%', 
						maxWidth: 400,
						borderRadius: 2,
					}}
				>
					{/* Header */}
					<Box sx={{ textAlign: 'center', mb: 4 }}>
						<Avatar 
							sx={{ 
								mx: 'auto', 
								mb: 2, 
								bgcolor: 'primary.main',
								width: 64,
								height: 64,
							}}
						>
							<GymIcon sx={{ fontSize: 32 }} />
						</Avatar>
						<Typography component="h1" variant="h4" color="primary" fontWeight="bold">
							Gestión de Gimnasio
						</Typography>
						<Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
							Inicia sesión en tu cuenta
						</Typography>
					</Box>

					{/* Error Alert */}
					{authError && (
						<Alert severity="error" sx={{ mb: 3 }}>
							{authError}
						</Alert>
					)}

					{/* Login Form */}
					<Box component="form" onSubmit={handleSubmit} noValidate>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Usuario"
							name="username"
							autoComplete="username"
							autoFocus
							value={credentials.username}
							onChange={handleInputChange('username')}
							error={!!errors.username}
							helperText={errors.username}
							disabled={isLoading}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<PersonIcon color="action" />
									</InputAdornment>
								),
							}}
						/>

						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Contraseña"
							type={showPassword ? 'text' : 'password'}
							id="password"
							autoComplete="current-password"
							value={credentials.password}
							onChange={handleInputChange('password')}
							error={!!errors.password}
							helperText={errors.password}
							disabled={isLoading}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<LockIcon color="action" />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="mostrar/ocultar contraseña"
											onClick={togglePasswordVisibility}
											edge="end"
											disabled={isLoading}
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2, py: 1.5 }}
							disabled={isLoading}
							size="large"
						>
							{isLoading ? (
								<>
									<CircularProgress size={20} sx={{ mr: 1 }} />
									Iniciando sesión...
								</>
							) : (
								'Iniciar Sesión'
							)}
						</Button>
					</Box>

					{/* Demo Credentials */}
					<Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
						<Typography variant="caption" color="text.secondary" display="block" gutterBottom>
							Credenciales de Demostración:
						</Typography>
						<Typography variant="caption" display="block">
							<strong>Propietario:</strong> admin_owner / owner123
						</Typography>
						<Typography variant="caption" display="block">
							<strong>Administrador:</strong> admin_checkin / admin123
						</Typography>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
} 