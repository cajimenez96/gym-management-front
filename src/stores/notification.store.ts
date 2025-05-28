import { create } from 'zustand';
import type { AlertColor } from '@mui/material/Alert';

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration: number | null;
  showSnackbar: (
    message: string,
    severity: AlertColor,
    autoHideDuration?: number | null
  ) => void;
  hideSnackbar: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  autoHideDuration: 6000,
  showSnackbar: (message, severity, autoHideDuration = 6000) =>
    set({
      open: true,
      message,
      severity,
      autoHideDuration,
    }),
  hideSnackbar: () =>
    set({
      open: false,
      // Optionally reset message and severity here if desired
      // message: '',
      // severity: 'info',
    }),
})); 