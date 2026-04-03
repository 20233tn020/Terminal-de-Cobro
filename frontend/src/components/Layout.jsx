import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider, Avatar, IconButton
} from '@mui/material';

// Íconos
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ContactlessIcon from '@mui/icons-material/Contactless';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === '/terminal') return 'Terminal IoT Activa';
    if (location.pathname === '/mercado') return 'Mercado y Valores';
    if (location.pathname === '/historial') return 'Historial Operativo';
    return 'SpaceBank';
  };

    const [user, setUser] = useState(null);



    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");

            if (stored) {
                const parsed = JSON.parse(stored);
                setUser(parsed);
            }

        } catch (error) {
            console.error("Error leyendo usuario:", error);
            localStorage.removeItem("user");
        }
    }, []);


  return (
    // CAMBIO 1: Forzamos width a 100vw y quitamos márgenes por defecto
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', bgcolor: '#ECEFF1', m: 0, p: 0 }}>

      {/* BARRA SUPERIOR FIJA */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100vw - ${drawerWidth}px)`, // CAMBIO 2: Usar 100vw en lugar de 100%
          ml: `${drawerWidth}px`,
          bgcolor: '#ECEFF1',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="#070825" fontWeight="bold">
            {getTitle()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: '#070825' }}><NotificationsIcon /></IconButton>
            <Typography color="#070825" variant="body2" fontWeight="bold">Asesor: {user ? user.nombre: "cargando.."}</Typography>
            <Avatar sx={{ width: 35, height: 35 }} src={user ? user.foto: "cargando..."}></Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MENÚ LATERAL FIJO */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#070825', color: '#ECEFF1', borderRight: 'none', boxShadow: '4px 0 15px rgba(0,0,0,0.1)' },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, mt: 1 }}>
          <RocketLaunchIcon sx={{ fontSize: 32, color: '#ECEFF1' }} />
          <Typography variant="h5" fontWeight="bold" letterSpacing={1}>SpaceBank</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(236, 239, 241, 0.1)', mt: 1 }} />

        <List sx={{ px: 2, pt: 3 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === '/terminal'}
              onClick={() => navigate('/terminal')}
              sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'rgba(236, 239, 241, 0.15)' }, '&:hover': { bgcolor: 'rgba(236, 239, 241, 0.08)' } }}
            >
              <ListItemIcon><ContactlessIcon sx={{ color: '#ECEFF1' }} /></ListItemIcon>
              <ListItemText primary="Terminal IoT" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === '/mercado'}
              onClick={() => navigate('/mercado')}
              sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'rgba(236, 239, 241, 0.15)' }, '&:hover': { bgcolor: 'rgba(236, 239, 241, 0.08)' } }}
            >
              <ListItemIcon><ShowChartIcon sx={{ color: '#ECEFF1' }} /></ListItemIcon>
              <ListItemText primary="Mercado y Valores" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === '/historial'}
              onClick={() => navigate('/historial')}
              sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'rgba(236, 239, 241, 0.15)' }, '&:hover': { bgcolor: 'rgba(236, 239, 241, 0.08)' } }}
            >
              <ListItemIcon><HistoryIcon sx={{ color: '#ECEFF1' }} /></ListItemIcon>
              <ListItemText primary="Historial" />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <List sx={{ px: 2, pb: 3 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
            }}

                            sx={{ borderRadius: 2, color: '#ff5252', '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.1)' } }}>
              <ListItemIcon><LogoutIcon sx={{ color: '#ff5252' }} /></ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <Box component="main" sx={{
        flexGrow: 1,
        width: `calc(100vw - ${drawerWidth}px)`, // CAMBIO 3: Calculamos exactamente el espacio restante
        p: 4,
        pt: 11,
        overflowX: 'hidden'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;