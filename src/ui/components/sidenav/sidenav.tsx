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
import { Link, useRouter } from '@tanstack/react-router';
import { useAuth } from '@/ui/hooks';
import { Route as LoginRoute } from '@/routes/login.tsx';

const DRAWER_WIDTH = 240;

type MenuItem = {
  text: string;
  icon: typeof SvgIcon;
  path: string;
};

const MENU_ITEMS: MenuItem[] = [
  { text: 'Register Member', icon: PersonAddIcon, path: '/register' },
  { text: 'Member List', icon: PeopleIcon, path: '/members' },
  { text: 'Process Payment', icon: PaymentIcon, path: '/payment' },
  { text: 'Payment History', icon: HistoryIcon, path: '/payment-history' },
  {
    text: 'Membership Plans',
    icon: CardMembershipIcon,
    path: '/membership-plans',
  },
  { text: 'Member Check-in', icon: HowToRegIcon, path: '/check-in' },
];

type MenuItemProps = MenuItem & {
  isSelected: boolean;
  onClick?: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  text,
  icon: Icon,
  path,
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

type LogoutButtonProps = {
  onClick: () => void;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => (
  <ListItemButton onClick={onClick}>
    <ListItemIcon>
      <LogoutIcon />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </ListItemButton>
);

type DrawerContentProps = {
  onItemClick?: () => void;
};

const DrawerContent: React.FC<DrawerContentProps> = ({ onItemClick }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    await router.invalidate();
    await router.navigate(LoginRoute);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Gym Management
        </Typography>
      </Box>
      <Divider />
      <List>
        {MENU_ITEMS.map(({ text, icon, path }) => (
          <MenuItem
            key={text}
            text={text}
            icon={icon}
            path={path}
            isSelected={router.state.location.pathname === path}
            onClick={onItemClick}
          />
        ))}
      </List>
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <LogoutButton onClick={handleLogout} />
      </Box>
    </Box>
  );
};

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

  if (!isMobile) {
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
