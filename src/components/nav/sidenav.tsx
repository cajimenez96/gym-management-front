import React from 'react';
import {
  CardMembership as CardMembershipIcon,
  History as HistoryIcon,
  HowToReg as HowToRegIcon,
  Logout as LogoutIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Link, useRouter, useMatchRoute } from '@tanstack/react-router';
import { useAuth } from '@/context';
import { Route as LoginRoute } from '@/routes/login.tsx';

const DRAWER_WIDTH = 240;

type MenuItem = {
  text: string;
  icon: typeof SvgIcon;
  path: string;
  roles: Array<'owner' | 'admin'>; // Add role-based access control
};

export const MENU_ITEMS: MenuItem[] = [
  { 
    text: 'Registrar Miembro', 
    icon: PersonAddIcon, 
    path: '/register', 
    roles: ['owner'] // Only owner can register members
  },
  { 
    text: 'Lista de Miembros', 
    icon: PeopleIcon, 
    path: '/members', 
    roles: ['owner'] // Both can view members (admin needs for check-in)
  },
  { 
    text: 'Procesar Pago', 
    icon: PaymentIcon, 
    path: '/payment', 
    roles: ['owner'] // Only owner handles payments
  },
  { 
    text: 'Historial de Pagos', 
    icon: HistoryIcon, 
    path: '/payment-history', 
    roles: ['owner'] // Only owner handles payments
  },
  {
    text: 'Planes de Membresía',
    icon: CardMembershipIcon,
    path: '/membership-plans',
    roles: ['owner'] // Only owner manages plans
  },
  { 
    text: 'Check-in de Miembro', 
    icon: HowToRegIcon, 
    path: '/check-in', 
    roles: ['owner', 'admin'] // Both can do check-ins (admin's main function)
  },
];

type MenuItemProps = MenuItem & {
  isSelected: boolean;
  onClick?: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  text,
  icon: Icon,
  path,
  roles, // Include roles but we don't need to use it in the component
  isSelected,
  onClick,
}) => (
  <ListItemButton
    component={Link}
    to={path}
    selected={isSelected}
    onClick={onClick}
  >
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItemButton>
);

function DrawerContent({ onItemClick }: { onItemClick?: () => void }) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const matchRoute = useMatchRoute();
  
  const handleLogout = async () => {
    await logout();
    await router.invalidate();
    await router.navigate(LoginRoute);
  };
  
  const isSelectedRoute = (path: string) => {
    return matchRoute({ to: path, fuzzy: true });
  };

  // Filter menu items based on user role
  const userRole = user?.role;
  const filteredMenuItems = MENU_ITEMS.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Gestión de Gimnasio
        </Typography>
        {user && (
          <Typography variant="caption" color="text.secondary">
            {user.username} ({user.role})
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {filteredMenuItems.map(({ text, icon, path, roles }) => (
          <MenuItem
            key={text}
            text={text}
            icon={icon}
            path={path}
            roles={roles}
            isSelected={isSelectedRoute(path)}
            onClick={onItemClick}
          />
        ))}
      </List>
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItemButton>
      </Box>
    </Box>
  );
}

type SidenavProps = {
  isMobile: boolean;
  mobileOpen: boolean;
  onClose: () => void;
};

export function Sidenav({ isMobile, mobileOpen, onClose }: SidenavProps) {
  const drawerProps = {
    sx: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
    },
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          ...drawerProps.sx,
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <DrawerContent onItemClick={onClose} />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        ...drawerProps.sx,
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <DrawerContent />
    </Drawer>
  );
}
