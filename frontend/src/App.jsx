import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import spaceTheme from './theme';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Componentes
import Login from './components/Login';
import ParticleBackground from './components/ParticleBackground';
import Layout from './components/Layout';
import Terminal from './components/Terminal';
import Market from './components/Market';
import History from './components/History';

function App() {
  return (
    <ThemeProvider theme={spaceTheme}>
      <CssBaseline />

      {/* El Router envuelve toda la aplicación */}
      <Router>
        <Routes>
          {/* RUTA 1: Login (Sin la barra lateral, pero con el fondo de estrellas) */}
          <Route path="/" element={
            <>
              <ParticleBackground />
              <Login />
            </>
          } />

          {/* RUTAS CON LA BARRA LATERAL (Envueltas en el Layout) */}
          <Route path="/terminal" element={
            <ProtectedRoute>
            <Layout>
              <Terminal />
            </Layout>
              </ProtectedRoute>
          } />

          <Route path="/mercado" element={
            <ProtectedRoute>
            <Layout>
              <Market />
            </Layout>
              </ProtectedRoute>
          } />

          <Route path="/historial" element={
            <ProtectedRoute>
            <Layout>
              <History />
            </Layout>
              </ProtectedRoute>
          } />
        </Routes>
      </Router>

    </ThemeProvider>
  );
}

export default App;