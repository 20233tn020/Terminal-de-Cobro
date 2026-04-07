import React, {useState} from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // Instanciamos el hook de navegación
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario,
                    password
                })
            });

            const data = await res.json();

            if (data.status) {
                localStorage.setItem("user", JSON.stringify(data.user));

                console.log("CREDENCIALES CORRECTAS");
                alert("CREDENCIALES CORRECTAS");

                navigate("/terminal");

            } else {
                alert("CONTRASEÑA INCORRECTA");
                setError(data.msj);
            }

        } catch (err) {
            setError("Error de conexión");
        }
    };






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
            name="usuarios"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            id="usuarios"
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
            value={password}
            id="pasword"
            name="pasword"
            onChange={(e) => setPassword(e.target.value)}
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
                <InputAdornment position="start" >
                  <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
              onClick={handleLogin}
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