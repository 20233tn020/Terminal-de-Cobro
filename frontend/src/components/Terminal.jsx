import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Avatar,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  InputAdornment, MenuItem, Divider, CircularProgress
} from '@mui/material';

// Íconos
import ContactlessIcon from '@mui/icons-material/Contactless';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';

// ─── COMPONENTE: TARJETA DE CRÉDITO 3D CON MÚLTIPLES DISEÑOS ────────────────
const SpaceCreditCard = ({ name, number, exp, ccv, tier }) => {

  // Diccionario de temas para los diferentes niveles de cliente
  const getCardTheme = (tierLevel) => {
    const themes = {
      'Inversor Estelar': {
        bg: 'linear-gradient(135deg, #121313 0%, #070825 100%)', // Oscuro profundo
        text: '#ECEFF1',
        stripe1: 'linear-gradient(to bottom, rgba(236,239,241,0.05), rgba(236,239,241,0.01))',
        stripe2: 'linear-gradient(to bottom, rgba(7,8,37,0.8), rgba(18,19,19,0.9))',
        logo: '#ECEFF1',
        shadow: '0 2px 2px rgba(0,0,0,0.5)'
      },
      'Inversor Lunar': {
        bg: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)', // Platino / Plata
        text: '#070825',
        stripe1: 'linear-gradient(to bottom, rgba(7,8,37,0.05), rgba(7,8,37,0.01))',
        stripe2: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(220,220,220,0.6))',
        logo: '#070825',
        shadow: 'none'
      },
      'Inversor Cometa': {
        bg: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', // Azul vibrante
        text: '#ffffff',
        stripe1: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
        stripe2: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.05))',
        logo: '#ffffff',
        shadow: '0 2px 2px rgba(0,0,0,0.2)'
      }
    };
    return themes[tierLevel] || themes['Inversor Estelar'];
  };

  const theme = getCardTheme(tier);

  return (
    <Box sx={{
      perspective: '1000px',
      width: 380,   // TAMAÑO AUMENTADO
      height: 240,  // TAMAÑO AUMENTADO
      margin: '0 auto',
      '&:hover .flip-container': { transform: 'rotateY(180deg)' }
    }}>
      <Box className="flip-container" sx={{
        width: '100%', height: '100%', transition: 'transform 0.8s', transformStyle: 'preserve-3d', position: 'relative'
      }}>

        {/* LADO FRONTAL */}
        <Box sx={{
          position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
          borderRadius: 4, overflow: 'hidden', color: theme.text,
          background: theme.bg,
          boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
        }}>
          {/* Franjas decorativas oblicuas */}
          <Box sx={{ position: 'absolute', right: 0, height: '100%', width: 190, background: theme.stripe1, transform: 'skewX(20deg) translateX(50px)' }} />
          <Box sx={{ position: 'absolute', right: 0, height: '100%', width: 210, background: theme.stripe2, transform: 'skewX(-15deg) translateX(50px)' }} />

          {/* Logo del Banco */}
          <Typography sx={{ position: 'absolute', top: 25, right: 25, fontWeight: '900', fontStyle: 'italic', fontSize: 20, color: theme.logo }}>SB</Typography>

          {/* Nivel de Cliente */}
          <Typography sx={{ position: 'absolute', top: 25, left: 25, textTransform: 'uppercase', letterSpacing: 2, fontSize: 11, fontWeight: 'bold' }}>
            {tier}
          </Typography>

          {/* Chip EMV */}
          <Box sx={{ position: 'absolute', top: 65, left: 25, width: 45, height: 35, borderRadius: 1, background: 'linear-gradient(to bottom left, #e0e0e0, #9e9e9e)', display: 'flex', flexWrap: 'wrap', overflow: 'hidden', border: '1px solid #757575', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            <Box sx={{ width: '100%', height: '33%', borderBottom: '1px solid #757575' }} />
            <Box sx={{ width: '100%', height: '33%', borderBottom: '1px solid #757575' }} />
            <Box sx={{ width: '50%', height: '100%', borderRight: '1px solid #757575', position: 'absolute', top: 0 }} />
          </Box>

          <ContactlessIcon sx={{ position: 'absolute', top: 68, left: 85, fontSize: 28, transform: 'rotate(90deg)', opacity: 0.8 }} />

          {/* Número de Tarjeta */}
          <Typography sx={{ position: 'absolute', bottom: 75, left: 25, fontSize: 22, fontFamily: 'monospace', letterSpacing: 3, textShadow: theme.shadow }}>
            {number}
          </Typography>

          {/* Fecha de Vencimiento */}
          <Box sx={{ position: 'absolute', bottom: 40, left: 25, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 7, textTransform: 'uppercase', lineHeight: 1, opacity: 0.8 }}>Exp<br/>End</Typography>
            <Typography sx={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold' }}>{exp}</Typography>
          </Box>

          {/* Nombre del Titular */}
          <Typography sx={{ position: 'absolute', bottom: 15, left: 25, textTransform: 'uppercase', fontFamily: 'monospace', fontSize: 14, letterSpacing: 1, textShadow: theme.shadow }}>
            {name}
          </Typography>

          {/* Logo Mastercard (Colores Originales) */}
          <Box sx={{ position: 'absolute', right: 25, bottom: 20, display: 'flex' }}>
            <Box sx={{ width: 35, height: 35, borderRadius: '50%', bgcolor: '#eb001b', opacity: 0.95, zIndex: 1 }} />
            <Box sx={{ width: 35, height: 35, borderRadius: '50%', bgcolor: '#f79e1b', opacity: 0.95, ml: -1.5, zIndex: 2 }} />
          </Box>
        </Box>

        {/* LADO TRASERO */}
        <Box sx={{
          position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
          borderRadius: 4, overflow: 'hidden', color: '#121313',
          background: '#ECEFF1', transform: 'rotateY(180deg)',
          boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
        }}>
          <Box sx={{ position: 'absolute', top: 25, width: '100%', height: 50, bgcolor: '#121313' }} />
          <Box sx={{ position: 'absolute', top: 100, left: '5%', width: '90%', height: 40, bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 2 }}>
            <Typography sx={{ fontStyle: 'italic', mr: 'auto', opacity: 0.3 }}>Firma Autorizada</Typography>
            <Typography sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 16 }}>{ccv}</Typography>
          </Box>
          <Typography sx={{ position: 'absolute', bottom: 15, left: '5%', width: '90%', fontSize: 9, textAlign: 'justify', opacity: 0.6 }}>
            Esta tarjeta es propiedad de SpaceBank. El uso indebido es un delito. Si la encuentra, por favor devuélvala a cualquier sucursal galáctica. Su uso está sujeto al contrato de crédito vigente.
          </Typography>
        </Box>

      </Box>
    </Box>
  );
};

// ─── COMPONENTE PRINCIPAL: TERMINAL ────────────────────────────────────────────
const Terminal = () => {
  // Estados de conexión
  const [connectionStatus, setConnectionStatus] = useState('esperando');

  // Estados de Operación (Ventanas y Formularios)
  const [openWindow, setOpenWindow] = useState(null);
  const [amount, setAmount] = useState('');

  // Estados de Animación de Transacción
  const [transactionState, setTransactionState] = useState('idle'); // idle, loading, success, rocket, ticket
  const [ticketData, setTicketData] = useState(null);

  const handleSimulateConnection = () => {
    setConnectionStatus('leyendo');
    setTimeout(() => setConnectionStatus('conectado'), 2500);
  };

  const handleDisconnect = () => setConnectionStatus('esperando');
  const handleOpenWindow = (functionName) => {
    setAmount('');
    setOpenWindow(functionName);
  };
  const handleCloseWindow = () => setOpenWindow(null);

  // ─── MOTOR DE ANIMACIÓN DE LA TRANSACCIÓN ───
  const processTransaction = (e) => {
    e.preventDefault();

    // Guardamos los datos para el ticket final
    const operationNames = { 'ingresar': 'Depósito', 'retirar': 'Retiro', 'transferir': 'Transferencia', 'divisas': 'Cambio Divisas' };
    setTicketData({
      id: Math.floor(Math.random() * 1000000000), // Folio aleatorio
      type: operationNames[openWindow],
      amount: parseFloat(amount || 0),
      date: new Date().toLocaleString()
    });

    // 1. Cierra el formulario y muestra la ventana única de animación
    setOpenWindow(null);
    setTransactionState('loading');

    // 2. A los 2 segundos, pasa suavemente a "Éxito (Palomita)"
    setTimeout(() => {
      setTransactionState('success');

      // 3. Al segundo, pasa suavemente a "Cohete Despegando"
      setTimeout(() => {
        setTransactionState('rocket');

        // 4. A los 1.5 segundos, muestra el "Ticket"
        setTimeout(() => {
          setTransactionState('ticket');
        }, 1500);

      }, 1000);
    }, 2000);
  };

  const closeTicket = () => setTransactionState('idle');

  const isConnected = connectionStatus === 'conectado';
  const isScanning = connectionStatus === 'leyendo';

  return (
    <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* VISTA 1: ESPERANDO TARJETA */}
      {!isConnected && (
        <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
          <Card sx={{ p: 6, width: '100%', maxWidth: 700, textAlign: 'center', borderRadius: 4, boxShadow: isScanning ? '0 0 50px rgba(255, 179, 0, 0.2)' : '0 15px 50px rgba(0,0,0,0.05)', border: isScanning ? '3px solid #ffb300' : '3px dashed #b0bec5', bgcolor: '#ffffff', transition: 'all 0.3s' }}>
            {!isScanning ? (
              <>
                <ContactlessIcon sx={{ fontSize: 130, color: '#070825', opacity: 0.2, mb: 3 }} />
                <Typography variant="h4" fontWeight="bold" color="#070825" gutterBottom>Terminal en Espera</Typography>
                <Typography variant="body1" color="text.secondary" mb={5}>Por favor, inserte la tarjeta del cliente en el lector físico.</Typography>
                <Button variant="contained" size="large" onClick={handleSimulateConnection} sx={{ bgcolor: '#070825', px: 6, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}>Simular Escaneo de Tarjeta</Button>
              </>
            ) : (
              <>
                <FingerprintIcon sx={{ fontSize: 130, color: '#ffb300', mb: 3, animation: 'pulse 1s infinite' }} />
                <Typography variant="h4" fontWeight="bold" color="#070825" gutterBottom>Leyendo Chip...</Typography>
                <Typography variant="body1" color="text.secondary" mb={5}>Extrayendo datos biométricos e historial financiero.</Typography>
                <Button variant="contained" disabled size="large" sx={{ px: 6, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}>Procesando Seguridad</Button>
              </>
            )}
          </Card>
        </Box>
      )}

      {/* VISTA 2: CLIENTE CONECTADO */}
      {isConnected && (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, animation: 'fadeIn 0.5s ease' }}>

          {/* EXPEDIENTE DEL CLIENTE */}
          <Card sx={{ width: '100%', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.06)', bgcolor: '#ffffff', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: '#070825', p: 2.5, color: '#ECEFF1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PersonIcon /> Expediente del Cliente</Typography>
              <Chip label="CONEXIÓN SEGURA ACTIVA" size="small" color="success" sx={{ fontWeight: 'bold' }} />
            </Box>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4} sx={{ borderRight: { md: '1px solid rgba(0,0,0,0.05)' }, pr: { md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                    <Avatar sx={{ width: 85, height: 85, bgcolor: '#ECEFF1', color: '#070825', border: '3px solid #00e676' }}><PersonIcon sx={{ fontSize: 50 }} /></Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#070825">Juan Pérez</Typography>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">ID: #99382-X</Typography>
                    </Box>
                  </Box>
                  <Typography variant="overline" color="text.secondary" fontWeight="bold">Contacto Verificado</Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><EmailIcon color="action" fontSize="small"/> <Typography variant="body2" color="text.tertiary">juan.perez@gmail.com</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><PhoneIcon color="action" fontSize="small"/> <Typography variant="body2" color="text.tertiary">+55 (342) 998-1234</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><LocationOnIcon color="action" fontSize="small"/> <Typography variant="body2" color="text.tertiary">Colonia Lunar, Sector 4.</Typography></Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3} sx={{ borderRight: { md: '1px solid rgba(0,0,0,0.05)' }, px: { md: 3 } }}>
                  <Typography variant="overline" color="text.secondary" fontWeight="bold" mb={2} display="block">Estado de Cuenta</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ p: 3, bgcolor: '#f5f7fa', borderRadius: 3, borderLeft: '5px solid #00e676' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">SALDO DISPONIBLE</Typography>
                      <Typography variant="h4" fontWeight="bold" color="#070825" mt={0.5}>$ 12,450.00</Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: '#f5f7fa', borderRadius: 3, borderLeft: '5px solid #070825' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">LÍNEA DE CRÉDITO</Typography>
                      <Typography variant="h5" fontWeight="bold" color="#070825" mt={0.5}>$ 50,000.00</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5} sx={{ pl: { md: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="overline" color="text.secondary" fontWeight="bold" mb={2} sx={{ width: '100%', maxWidth: 380 }}>Tarjeta Vinculada</Typography>
                  <SpaceCreditCard name="JUAN PÉREZ" number="5453  2000  0000  9876" exp="11/28" ccv="842" tier="Inversor Estelar" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* PANEL DE OPERACIONES */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography variant="h5" fontWeight="bold" color="#070825">Panel de Operaciones</Typography>
               <Button variant="outlined" color="error" onClick={handleDisconnect} sx={{ borderRadius: 2, borderWidth: 2, fontWeight: 'bold' }}>Expulsar Tarjeta y Cerrar</Button>
            </Box>

            <Grid container spacing={3}>
              {[
                { id: 'ingresar', icon: <AddCircleOutlineIcon sx={{ fontSize: 50, mb: 1.5 }} />, label: 'Ingresar Efectivo', desc: 'Abonar a cuenta' },
                { id: 'retirar', icon: <RemoveCircleOutlineIcon sx={{ fontSize: 50, mb: 1.5 }} />, label: 'Retirar Efectivo', desc: 'Requiere NIP' },
                { id: 'transferir', icon: <SendIcon sx={{ fontSize: 50, mb: 1.5 }} />, label: 'Transferencia', desc: 'A terceros' },
                { id: 'divisas', icon: <SwapHorizIcon sx={{ fontSize: 50, mb: 1.5 }} />, label: 'Cambio Divisas', desc: 'Compra/Venta' }
              ].map((btn) => (
                <Grid size={3} item xs={12} sm={6} md={3} key={btn.id}>
                  <Card onClick={() => handleOpenWindow(btn.id)} sx={{ cursor: 'pointer', bgcolor: '#070825', color: '#ECEFF1', borderRadius: 4, p: 2, transition: '0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 30px rgba(7, 8, 37, 0.3)' } }}>
                    <CardContent sx={{ textAlign: 'center', p: 3, '&:last-child': { pb: 3 } }}>
                      {btn.icon}
                      <Typography variant="h6" fontWeight="bold">{btn.label}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>{btn.desc}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* =========================================================================
          MODALES DE FORMULARIO (MÁS PROFESIONALES Y LIMPIOS)
          ========================================================================= */}
      <Dialog
        open={!!openWindow && transactionState === 'idle'}
        onClose={handleCloseWindow}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: '#fff' } }} // Fondo Blanco
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#070825', pb: 1 }}>
          {openWindow === 'ingresar' && "Depósito en Efectivo"}
          {openWindow === 'retirar' && "Retiro en Efectivo"}
          {openWindow === 'transferir' && "Transferencia a Terceros"}
          {openWindow === 'divisas' && "Compra / Venta de Divisas"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={4} >
            Por favor, verifique el monto antes de proceder con la autorización en la bóveda.
          </Typography>

          <form id="operation-form" onSubmit={processTransaction}>
            {openWindow === 'transferir' && (
                <TextField  fullWidth label="Cuenta Destino (CLABE/Tarjeta)" variant="filled" sx={{ mb: 3 }} required InputProps={{sx: {color: "#90caf9"}}}/>
            )}

            {openWindow === 'divisas' && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6 }><TextField select fullWidth label="Origen"  defaultValue="USD" variant="filled" sx={{
                    '& .MuiInputBase-input': {
                        color: '#90caf9'
                    },
                    '& .MuiInputLabel-root': {
                        color: '#90caf9'
                    }
                }}><MenuItem value="USD">Créditos</MenuItem><MenuItem value="EUR">Euros</MenuItem></TextField></Grid>
                <Grid item xs={6}><TextField select fullWidth label="Destino" defaultValue="EUR" variant="filled"
                sx={{
                      '& .MuiInputBase-input': {
                      olor: '#90caf9'
                      },
                      '& .MuiInputLabel-root': {
                      color: '#90caf9'
                      }
                }}
                ><MenuItem value="USD">Créditos</MenuItem><MenuItem value="EUR">Euros</MenuItem></TextField></Grid>
              </Grid>
            )}

            <TextField
              autoFocus fullWidth required type="number"
              label="Monto de la Operación" variant="filled"
              value={amount}   onChange={(e) => setAmount(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, sx: { fontSize: '1.5rem', fontWeight: 'bold',  } }}
              InputProps={{
                  sx: {
                      color: "#90caf9" // 🔥 texto que escribes
                  }
              }}
            />
          </form>

        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, flexDirection: 'column', gap: 1 }}>
          <Button type="submit" form="operation-form" fullWidth variant="contained" size="large" sx={{ bgcolor: '#070825', borderRadius: 2 }}>
            Autorizar Transacción
          </Button>
          <Button fullWidth onClick={handleCloseWindow} color="inherit" sx={{ borderRadius: 2 }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================================
          MODAL ÚNICO DE ANIMACIÓN FLUIDA (CARGA -> ÉXITO -> COHETE)
          ========================================================================= */}
      <Dialog
        open={['loading', 'success', 'rocket'].includes(transactionState)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 4, textAlign: 'center', minHeight: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#ffffff' } }} // Fondo Blanco
      >

        {/* Lógica de Transiciones Fluidas basada en el estado */}
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            {/* 1. Etapa de Carga (CircularProgress) */}
            <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                opacity: transactionState === 'loading' ? 1 : 0,
                visibility: transactionState === 'loading' ? 'visible' : 'hidden',
                transition: 'opacity 0.4s, visibility 0.4s'
            }}>
                <CircularProgress size={80} thickness={4} sx={{ color: '#070825', mb: 3 }} />
                <Typography variant="h6" fontWeight="bold" color="#070825">Validando Seguridad...</Typography>
                <Typography variant="body2" color="text.secondary">Contactando con los servidores centrales.</Typography>
            </Box>

            {/* 2. Etapa de Éxito (Palomita en color principal) */}
            <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                opacity: transactionState === 'success' ? 1 : 0,
                visibility: transactionState === 'success' ? 'visible' : 'hidden',
                transition: 'opacity 0.4s, visibility 0.4s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: transactionState === 'success' ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
            }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#070825', mb: 2 }} /> {/* User requested colors.primary */}
                <Typography variant="h5" fontWeight="bold" color="#070825">¡Transacción Exitosa!</Typography>
                <Typography variant="body2" color="text.secondary">Los fondos han sido procesados.</Typography>
            </Box>

            {/* 3. Etapa de Cohete Despegando */}
            <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                opacity: transactionState === 'rocket' ? 1 : 0,
                visibility: transactionState === 'rocket' ? 'visible' : 'hidden',
                transition: 'opacity 0.4s, visibility 0.4s, transform 0.4s',
                transform: transactionState === 'rocket' ? 'translate(-50%, -50%)' : 'translate(-50%, 0%)', // Cohete aparece desde abajo
                animation: transactionState === 'rocket' ? 'rocketTakeoff 1.5s ease-in forwards' : 'none',
                '@keyframes rocketTakeoff': {
                    '0%': { transform: 'translate(-50%, -50%) translateY(0px)' },
                    '20%': { transform: 'translate(-50%, -50%) translateY(0px)' },
                    '100%': { transform: 'translate(-50%, -50%) translateY(-250px)', opacity: 0 }
                }
            }}>
                <RocketLaunchIcon sx={{ fontSize: 120, color: '#070825' }} />
                <Typography variant="h5" fontWeight="bold" color="#070825" mt={2} sx={{ opacity: 0.5 }}>Despegando...</Typography>
            </Box>

        </Box>
      </Dialog>

      {/* =========================================================================
          MODAL DEL TICKET FINAL (ESTILO COMPROBANTE BANCARIO)
          ========================================================================= */}
      <Dialog
        open={transactionState === 'ticket'}
        maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0, p: 2, bgcolor: '#ffffff', color: '#000000', // Fondo Blanco
            borderTop: '8px solid #070825', borderBottom: '8px dashed #cccccc'
          }
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          {/* Cabecera del Ticket con Logo de SpaceBank */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <RocketLaunchIcon sx={{ fontSize: 40, color: '#070825', mb: 1 }} />
            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 1 }}>SPACEBANK S.A.</Typography>
            <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>Sucursal Base Lunar Alpha</Typography>
            <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', mt: 1 }}>COMPROBANTE DE OPERACIÓN</Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

          {/* Datos de la Operación */}
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>FECHA:</span><span>{ticketData?.date}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>CAJERO:</span><span>Terminal IoT #01</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>FOLIO:</span><span>{ticketData?.id}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>CLIENTE:</span><span>JUAN PÉREZ</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>CUENTA:</span><span>**** 9876</span>
            </Box>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

          {/* Totales */}
          <Box sx={{ fontFamily: 'monospace', textAlign: 'right' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <span>TIPO DE MOVIMIENTO:</span>
              <span style={{ fontWeight: 'bold' }}>{ticketData?.type?.toUpperCase()}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', mt: 2, fontSize: '1.2rem', color: '#070825' }}>
              <span>TOTAL OPERADO:</span>
              <span>${ticketData?.amount?.toFixed(2)}</span>
            </Box>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

          {/* Mensaje Final */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
             <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>*** GRACIAS POR CONFIAR EN SPACEBANK ***</Typography>
             <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.6rem', opacity: 0.6 }}>Conserve este comprobante para cualquier aclaración galáctica.</Typography>
          </Box>

        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1, p: 2, bgcolor: '#ffffff' }}> {/* Fondo Blanco */}
            <Button fullWidth variant="contained" sx={{ bgcolor: '#070825', borderRadius: 2 }} startIcon={<ReceiptLongIcon />} onClick={closeTicket}>
                Aceptar y Finalizar
            </Button>
            <Button fullWidth variant="outlined" sx={{ color: '#070825', borderColor: '#070825', borderRadius: 2 }} startIcon={<PrintIcon />} onClick={() => window.print()}>
                Imprimir Comprobante
            </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Terminal;