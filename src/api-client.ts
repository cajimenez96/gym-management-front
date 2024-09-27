import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD
	? import.meta.env.VITE_API_BASE_URL
	: 'http://localhost:3001';

export const apiClient = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

export const MEMBERS_URL = '/members';
export const MEMBERSHIP_PLANS_URL = '/membership-plans';
export const PAYMENTS_URL = '/payments';
export const CHECK_INS_URL = '/check-ins';
