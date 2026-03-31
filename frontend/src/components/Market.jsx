import React, { useState, useEffect, useCallback } from 'react';

import {
  Box, Typography, Card, CardContent, Grid, Avatar,
  CircularProgress, Button, Chip, TextField, InputAdornment,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { LineChart } from '@mui/x-charts/LineChart';

// ─── PALETA DE COLORES ─────────────────────────────────────────────────────────
const themeColors = {
  primary: '#070825',
  secondary: '#ECEFF1',
  complementary: '#121313',
  textos: '#ECEFF1',
  up: '#00c853',
  down: '#d50000',
  cardBg: '#ffffff',
  border: 'rgba(7, 8, 37, 0.08)'
};

// ─── UTILIDADES DE FORMATO ─────────────────────────────────────────────────────
const formatCurrency = (val, maxDecimals = 2) => {
  if (val === undefined || val === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: val < 1 ? 4 : 2,
    maximumFractionDigits: val < 1 ? 4 : maxDecimals
  }).format(val);
};

const formatCompactNumber = (num) => {
  if (!num) return '—';
  return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(num);
};

const formatPercentage = (num) => {
  if (num === undefined || num === null) return '—';
  const isPositive = num >= 0;
  return (
    <Box component="span" sx={{ color: isPositive ? themeColors.up : themeColors.down, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
      {isPositive ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
      {Math.abs(num).toFixed(2)}%
    </Box>
  );
};

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function Market() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState({ dates: [], prices: [] });
  const [timeRange, setTimeRange] = useState('1');
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  //VARIVLES PARA  TODAS LAS MONEDAS
  const [marketData, setMarketData] = useState([]);
  // ==========================
  // 🔥 OBTENER MONEDAS (TU BACKEND)
  // ==========================
  const fetchMarketData = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/mercado/activos");

      if (!res.ok) throw new Error("Error en API");

      const data = await res.json();

      setMarketData(data);

      if (!selectedCoin && data.length > 0) {
        setSelectedCoin(data[0]);
      }

    } catch (error) {
      console.warn("Usando datos de respaldo");

      const fallbackData = [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          current_price: 66840,
        },
        {
          id: "ethereum",
          symbol: "eth",
          name: "Ethereum",
          current_price: 3450,
        },
      ];

      setMarketData(fallbackData);

      if (!selectedCoin) setSelectedCoin(fallbackData[0]);

    } finally {
      setLoadingTop(false);
    }
  }, [selectedCoin]);

  // ==========================
  // 🔥 AUTO ACTUALIZACIÓN
  // ==========================
  useEffect(() => {
    fetchMarketData(); // primera carga

    const interval = setInterval(fetchMarketData, 10000); // cada 10s

    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // ==========================
  // 🔍 FILTRO (opcional)
  // ==========================
  const filteredCoins = marketData.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==========================
  // 🖥️ UI BÁSICA
  // ==========================

  // =============================================================================================================================
  // 2. OBTENER GRÁFICA DEL ACTIVO SELECCIONADO
  const fetchChartData = useCallback(async (coinId, days) => {
    setLoadingChart(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/mercado/historial/${coinId}?dias=${days}`)
      if (!res.ok) throw new Error('Error en API');
      const data = await res.json();

      const step = Math.ceil(data.prices.length / 100);
      const filteredPrices = data.prices.filter((_, index) => index % step === 0 || index === data.prices.length - 1);

      setChartData({
        dates: filteredPrices.map(p => new Date(p[0])),
        prices: filteredPrices.map(p => p[1])
      });
    } catch (error) {
      const fakeDates = [];
      const fakePrices = [];
      let currentPrice = selectedCoin?.current_price || 50000;
      const now = Date.now();
      const interval = (days * 24 * 60 * 60 * 1000) / 50;
      for (let i = 50; i >= 0; i--) {
        fakeDates.push(new Date(now - (i * interval)));
        currentPrice = currentPrice + (currentPrice * (Math.random() - 0.48) * 0.02);
        fakePrices.push(currentPrice);
      }
      setChartData({ dates: fakeDates, prices: fakePrices });
    } finally {
      setLoadingChart(false);
    }
  }, [selectedCoin]);





  useEffect(() => { fetchMarketData(); }, [fetchMarketData]);
  useEffect(() => {
    if (selectedCoin) fetchChartData(selectedCoin.id, timeRange);
  }, [selectedCoin, timeRange, fetchChartData]);

  const filteredData = marketData.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUp = selectedCoin?.price_change_percentage_24h >= 0;
  const chartColor = isUp ? themeColors.up : themeColors.down;

  return (
    // Limitamos la altura exacta de la pantalla para evitar que la app entera haga scroll
    <Box sx={{ bgcolor: themeColors.secondary, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* CABECERA PRINCIPAL (Se queda fija arriba para que no salte al cargar) */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" color={themeColors.primary} sx={{ letterSpacing: '-0.5px' }}>
            Explorador de Activos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análisis profundo, capitalización y tendencias en tiempo real.
          </Typography>
        </Box>
      </Box>

      {loadingTop ? (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: themeColors.primary }} />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ flexGrow: 1, minHeight: 0, m: 0, width: '100%' }}>

          {/* ─── COLUMNA IZQUIERDA: DETALLES Y GRÁFICA (Estática) ─── */}
          <Grid size={8} item xs={12} lg={8} mt={-1} sx={{ height: '100%', overflowY: 'auto', pr: { lg: 1 } }}>

            {selectedCoin && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 2 }}>

                {/* TARJETA SUPERIOR: HEADER DEL ACTIVO */}
                <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: `1px solid ${themeColors.border}`, bgcolor: themeColors.cardBg }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                      <Grid item display="flex" alignItems="center" gap={3}>
                        <Avatar src={selectedCoin.image} sx={{ width: 64, height: 64, p: 0.5, bgcolor: '#f5f5f5', border: `1px solid ${themeColors.border}` }} />
                        <Box>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Typography variant="h4" fontWeight="bold" color={themeColors.primary}>
                              {selectedCoin.name}
                            </Typography>
                            <Chip label={selectedCoin.symbol.toUpperCase()} size="small" sx={{ fontWeight: 'bold', bgcolor: themeColors.primary, color: '#fff', borderRadius: 1 }} />
                            <Chip label={`Rank #${selectedCoin.market_cap_rank || '?'}`} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Activo Digital • Mercado Global
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item textAlign="right">
                        <Typography variant="h4" fontWeight="900" color={themeColors.primary}>
                          {formatCurrency(selectedCoin.current_price)}
                        </Typography>
                        <Box sx={{ mt: 0, fontSize: '1.1rem' }}>
                          {formatPercentage(selectedCoin.price_change_percentage_24h)}
                          <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>vs ayer</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* TARJETA CENTRAL: GRÁFICA Y CONTROLES */}
                <Card sx={{ mt: -1, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: `1px solid ${themeColors.border}`, bgcolor: themeColors.cardBg }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${themeColors.border}` }}>
                    <Typography variant="h6" fontWeight="bold" color={themeColors.primary} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShowChartIcon /> Evolución del Precio
                    </Typography>
                    <Box sx={{ bgcolor: '#f5f7fa', borderRadius: 2, p: 0.5, display: 'flex', gap: 0.5 }}>
                      {[
                        { label: '1D', val: '1' },
                        { label: '1S', val: '7' },
                        { label: '1M', val: '30' },
                        { label: '1A', val: '365' }
                      ].map((btn) => (
                        <Button
                          key={btn.val}
                          disableElevation
                          variant={timeRange === btn.val ? 'contained' : 'text'}
                          onClick={() => setTimeRange(btn.val)}
                          sx={{
                            minWidth: 40, px: 2, py: 0.5, borderRadius: 1.5, fontWeight: 'bold',
                            bgcolor: timeRange === btn.val ? themeColors.primary : 'transparent',
                            color: timeRange === btn.val ? '#fff' : 'text.secondary',
                            '&:hover': { bgcolor: timeRange === btn.val ? themeColors.primary : '#e0e4e8' }
                          }}
                        >
                          {btn.label}
                        </Button>
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ p: 2, height: 355, position: 'relative' }}>
                    {loadingChart ? (
                      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress sx={{ color: themeColors.primary }} />
                      </Box>
                    ) : (
                      <LineChart
                        xAxis={[{
                          data: chartData.dates,
                          scaleType: 'time',
                          valueFormatter: (date) => {
                            if (timeRange === '1') return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' });
                            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                          }
                        }]}
                        yAxis={[{
                          min: Math.min(...chartData.prices) * 0.99,
                          max: Math.max(...chartData.prices) * 1.01,
                          valueFormatter: (v) => `$${formatCompactNumber(v)}`
                        }]}
                        series={[{
                          data: chartData.prices,
                          area: true,
                          color: chartColor,
                          showMark: false,
                          valueFormatter: (v) => formatCurrency(v)
                        }]}
                        margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
                        sx={{
                          '.MuiLineElement-root': { strokeWidth: 3 },
                          '.MuiAreaElement-root': { fillOpacity: 0.1 },
                          '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': { fill: '#546e7a', fontWeight: 500 },
                          '.MuiChartsAxis-left .MuiChartsAxis-tickLabel': { fill: '#546e7a', fontWeight: 500 },
                          '.MuiChartsAxis-line': { stroke: '#cfd8dc' },
                          '.MuiChartsAxis-tick': { stroke: '#cfd8dc' }
                        }}
                      />
                    )}
                  </Box>
                </Card>

                {/* GRID INFERIOR: METRICAS CLAVE REFINADAS */}
                <Grid mt={-1} container spacing={3}>
                  <Grid size={3} item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" fontWeight="bold" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountBalanceIcon fontSize="small"/> Cap. de Mercado
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color={themeColors.textos}>
                          ${formatCompactNumber(selectedCoin.market_cap)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={3} item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" fontWeight="bold" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon fontSize="small"/> Volumen (24h)
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color={themeColors.textos}>
                          ${formatCompactNumber(selectedCoin.total_volume)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={3} item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" fontWeight="bold" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShowChartIcon fontSize="small"/> Circulante
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color={themeColors.textos}>
                          {formatCompactNumber(selectedCoin.circulating_supply)} {selectedCoin.symbol.toUpperCase()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={3} item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" fontWeight="bold" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmojiEventsIcon fontSize="small"/> Máx. Histórico (ATH)
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color={themeColors.textos}>
                          {formatCurrency(selectedCoin.ath)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

              </Box>
            )}
          </Grid>

          {/* ─── COLUMNA DERECHA: LISTA DE MERCADO (Deslizable) ─── */}
          <Grid mt={-2} item xs={12} lg={4} sx={{ height: '100%', pb: 2 }}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: `1px solid ${themeColors.border}`, bgcolor: themeColors.cardBg, overflow: 'hidden' }}>

              <Box sx={{ p: 3, pb: 2, borderBottom: `1px solid ${themeColors.border}`, flexShrink: 0 }}>
                <Typography variant="h6" fontWeight="bold" color={themeColors.primary} mb={2}>
                  Mercado Global
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar activo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                    sx: { borderRadius: 2, bgcolor: '#f5f7fa', color:'#000000','& fieldset': { border: 'none' } }
                  }}
                />
              </Box>

              {/* Esta es la parte que hace scroll interno */}
              <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#cfd8dc', borderRadius: '4px' } }}>
                {filteredData.map((coin) => (
                  <React.Fragment key={coin.id}>
                    <ListItem
                      button
                      onClick={() => setSelectedCoin(coin)}
                      sx={{
                        py: 2, px: 3,
                        bgcolor: selectedCoin?.id === coin.id ? 'rgba(7, 8, 37, 0.04)' : 'transparent',
                        borderLeft: selectedCoin?.id === coin.id ? `4px solid ${themeColors.primary}` : '4px solid transparent',
                        transition: '0.2s',
                        '&:hover': { bgcolor: 'rgba(7, 8, 37, 0.02)' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={coin.image} sx={{ width: 36, height: 36 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight="bold" color={themeColors.primary}>{coin.symbol.toUpperCase()}</Typography>
                            <Typography fontWeight="bold" color={themeColors.primary}>{formatCurrency(coin.current_price)}</Typography>
                          </Box>
                        }
                        secondary={
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                            <Typography variant="body2" color="text.secondary">{coin.name}</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {formatPercentage(coin.price_change_percentage_24h)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider component="li" sx={{ borderColor: themeColors.border }} />
                  </React.Fragment>
                ))}
                {filteredData.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No se encontraron activos.</Typography>
                  </Box>
                )}
              </List>
            </Paper>
          </Grid>

        </Grid>
      )}
    </Box>
  );
}