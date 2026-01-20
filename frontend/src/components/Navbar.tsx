'use client';

import { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, ExitToApp } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/providers/AuthProvider';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Não mostrar navbar nas páginas de login e cadastro
  const hideNavbar = pathname === '/login' || pathname === '/register';

  if (hideNavbar) {
    return null;
  }

  // Verificar se o usuário é admin (userType === 1)
  const isAdmin = user?.userType === 1;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    setMobileOpen(false);
    try {
      await api.post('/v1/logout');
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      router.push('/login');
    }
  };

  const handleNavigation = (path: string) => {
    setMobileOpen(false);
    router.push(path);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Minhas Redações', path: '/essays' },
    { label: 'Nova Redação', path: '/proposals' },
    ...(isAdmin ? [{ label: 'Adicionar Proposta', path: '/admin/add-proposal' }] : []),
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold' }}>
        Grammaid
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ExitToApp sx={{ mr: 2 }} />
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: isAdmin ? '#91103c' : undefined,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 28, py: 0.25 }}>
            {/* Menu hamburguer - apenas mobile */}
            <IconButton
              color="inherit"
              aria-label="abrir menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={() => router.push('/dashboard')}
            >
              Grammaid
            </Typography>

            {/* Menu desktop - esconde em mobile */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => router.push(item.path)}
                  sx={{
                    fontWeight: pathname === item.path ? 'bold' : 'normal',
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {user?.email && (
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 0.5,
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 1,
                  }}
                >
                  {user.email} {user.userLevel && `(${user.userLevel})`}
                </Typography>
              )}
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<ExitToApp />}
              >
                Sair
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer para mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Melhor performance em mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
