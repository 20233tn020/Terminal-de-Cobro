import { createTheme } from '@mui/material/styles';

const spaceTheme = createTheme({
  palette: {
    primary: {
      main: '#070825', // Azul profundo espacial
    },
    secondary: {
      main: '#ECEFF1', // Blanco estelar
    },
    background: {
      default: '#121313', // Negro vacío complementario
      paper: 'rgba(7, 8, 37, 0.85)', // Fondo de tarjetas translúcido
    },
    text: {
      primary: '#ECEFF1',
      secondary: '#90caf9',
      tertiary: '#121313',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default spaceTheme;