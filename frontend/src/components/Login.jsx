import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // Instanciamos el hook de navegación
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw', // Fuerza a tomar todo el ancho de la pantalla
        position: 'absolute', // Rompe cualquier estilo por defecto de Vite
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <Card
        sx={{
          minWidth: 350,
          padding: 3,
          backgroundColor: 'none', // Sin blancos, totalmente transparente
          backdropFilter: 'blur(5npx)', // Solo el difuminado puro
          border: '1px solid rgba(255, 255, 255, 0.15)', // Un borde súper fino para delimitar
          boxShadow: 'none', // ¡Adiós brillo azul!
          borderRadius: 4, // Bordes un poco más suaves
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RocketLaunchIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="secondary.main">
            SpaceBank
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: 'secondary.light' }}>
            Accede a tu bóveda estelar
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Usuario"
            sx={{
              mb: 3,
              input: { color: 'white' },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="password"
            variant="outlined"
            placeholder="Contraseña"
            sx={{
              mb: 4,
              input: { color: 'white' },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={() => navigate('/terminal')}
            fullWidth
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'secondary.main', // Botón blanco
              color: 'primary.main', // Letras color azul espacial
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'secondary.dark',
              }
            }}
          >
            Iniciar
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;