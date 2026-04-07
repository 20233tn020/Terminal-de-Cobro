import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

// Importaciones para Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Validación básica para no enviar peticiones vacías
    if (!usuario || !password) {
      toast.warning("Por favor, llena todos los campos.");
      return;
    }

    // Usamos un Toast de "Cargando"
    const idToast = toast.loading("Verificando credenciales...");

    try {
      // AQUÍ IRÁ LA URL DE TU AWS API GATEWAY CUANDO LA DESPLIEGUES
      const API_URL = "https://a4jie6cxsg.execute-api.us-east-1.amazonaws.com/api/login/auth";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
      });

      const data = await res.json();

      if (res.ok && data.status) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // Actualizamos el toast a éxito
        toast.update(idToast, { render: "¡Bienvenido a SpaceBank!", type: "success", isLoading: false, autoClose: 2000 });

        // Retrasamos un poco la navegación para que se vea el mensaje
        setTimeout(() => navigate("/terminal"), 2000);

      } else {
        // Actualizamos el toast a error
        toast.update(idToast, { render: data.msj || "Credenciales incorrectas", type: "error", isLoading: false, autoClose: 3000 });
      }

    } catch (err) {
      toast.update(idToast, { render: "Error de conexión con los servidores.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>

      {/* Contenedor de las notificaciones */}
      <ToastContainer theme="dark" position="top-right" />

      <Card sx={{ minWidth: 350, padding: 3, backgroundColor: 'transparent', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: 'none', borderRadius: 4 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RocketLaunchIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="secondary.main">
            SpaceBank
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: 'secondary.light' }}>
            Accede a tu bóveda estelar
          </Typography>

          <TextField
            fullWidth variant="outlined" placeholder="Usuario" name="usuarios" value={usuario}
            onChange={(e) => setUsuario(e.target.value)} id="usuarios"
            sx={{ mb: 3, input: { color: 'white' }, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' }, '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /></InputAdornment>) }}
          />

          <TextField
            fullWidth type="password" variant="outlined" placeholder="Contraseña" value={password} id="pasword" name="pasword"
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 4, input: { color: 'white' }, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' }, '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
            InputProps={{ startAdornment: (<InputAdornment position="start" ><LockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /></InputAdornment>) }}
          />

          <Button onClick={handleLogin} fullWidth variant="contained" size="large" sx={{ bgcolor: 'secondary.main', color: 'primary.main', fontWeight: 'bold', '&:hover': { bgcolor: 'secondary.dark' } }}>
            Iniciar
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;