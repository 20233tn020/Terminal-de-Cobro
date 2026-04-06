import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

                if (!storedUser.id) {
                    setError("Sesión no válida. Por favor, inicie sesión nuevamente.");
                    setLoading(false);
                    return;
                }

                const API_URL = "https://a4jie6cxsg.execute-api.us-east-1.amazonaws.com/api/historial";

                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_admin: storedUser.id, filtro: filtro })
                });

                const data = await res.json();

                if (res.ok && data.status) {
                    setHistory(data.historial);
                    setError(null); // Limpiamos errores pasados si los hubo
                } else {
                    setError(data.msj || "Error al cargar el historial.");
                }

            } catch (err) {
                setError("Error de conexión con el servidor maestro.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [filtro]);

    const getOperationColor = (tipo) => {
        const tipos = {
            'deposito': 'success',
            'retiro': 'error',
            'transferencia': 'info',
            'cambio_divisas': 'warning'
        };
        return tipos[tipo] || 'default';
    };

    const formatMoney = (val, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(val);

    return (
        <Box>
            {/* CABECERA CON TÍTULO Y SELECTOR DE FILTRO */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" color="#070825" fontWeight="bold">
                Registro de Operaciones
            </Typography>

            <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="filtro-label" sx={{ color: '#070825' }}>Periodo de Tiempo</InputLabel>
                <Select
                    labelId="filtro-label"
                    value={filtro}
                    label="Periodo de Tiempo"
                    onChange={(e) => setFiltro(e.target.value)}
                    sx={{
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        color: '#070825',
                        '& .MuiSvgIcon-root': {
                            color: '#070825'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(7, 8, 37, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#070825'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#070825'
                        }
                    }}
                >
                    <MenuItem value="todos">Todos los registros</MenuItem>
                    <MenuItem value="hoy">El día de hoy</MenuItem>
                    <MenuItem value="semana">Últimos 7 días</MenuItem>
                    <MenuItem value="mes">Último mes</MenuItem>
                </Select>
            </FormControl>
        </Box>

            {/* ESTADO: CARGANDO */}
            {loading && (
                <Typography color="text.secondary" mb={2}>Estableciendo conexión segura y filtrando datos...</Typography>
            )}

            {/* ESTADO: ERROR O SIN DATOS (TARJETA AZUL) */}
            {(!loading && (error || history.length === 0)) && (
                <Card sx={{
                    p: 5, textAlign: 'center', borderRadius: 4,
                    bgcolor: '#070825', color: '#ECEFF1', border: 'none',
                    boxShadow: '0 15px 40px rgba(7, 8, 37, 0.2)'
                }}>
                    {error ? (
                        <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ff5252', mb: 2 }} />
                    ) : (
                        <HistoryIcon sx={{ fontSize: 80, color: '#ECEFF1', mb: 2, opacity: 0.5 }} />
                    )}

                    <Typography variant="h6" gutterBottom>
                        {history.length === 0 && !error
                            ? "No hay movimientos registrados en el periodo seleccionado."
                            : "Bitácora de movimientos realizados por ti en el turno actual."}
                    </Typography>

                    {error && (
                        <Typography variant="body2" sx={{ color: '#ff5252', fontWeight: 'bold', mt: 1 }}>
                            Falla reportada: {error}
                        </Typography>
                    )}
                </Card>
            )}

            {/* ESTADO: DATOS CARGADOS (TABLA) */}
            {(!loading && !error && history.length > 0) && (
                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#070825' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#ECEFF1', fontWeight: 'bold' }}>Fecha y Hora</TableCell>
                                <TableCell sx={{ color: '#ECEFF1', fontWeight: 'bold' }}>Operación</TableCell>
                                <TableCell sx={{ color: '#ECEFF1', fontWeight: 'bold' }}>Cliente / Tarjeta</TableCell>
                                <TableCell sx={{ color: '#ECEFF1', fontWeight: 'bold' }}>Asesor Operativo</TableCell>
                                <TableCell sx={{ color: '#ECEFF1', fontWeight: 'bold' }}>Monto Transado</TableCell>
                                <TableCell sx={{ color: '#ECEFF1', fontWeight: 'bold' }}>Detalles</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        bgcolor: '#ffffff',
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { bgcolor: '#f5f7fa' }
                                    }}
                                >
                                    <TableCell sx={{ whiteSpace: 'nowrap', color: '#070825' }}>{row.fecha_formateada}</TableCell>
                                    <TableCell>
                                        <Chip label={row.tipo_operacion.toUpperCase().replace('_', ' ')} color={getOperationColor(row.tipo_operacion)} size="small" sx={{ fontWeight: 'bold' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold" color="#070825">{row.nombre_cliente}</Typography>
                                        <Typography variant="caption" color="text.secondary" fontFamily="monospace">{row.numero_tarjeta}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ color: '#070825' }}>{row.nombre_admin}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#070825' }}>{formatMoney(row.monto, row.moneda)} {row.moneda}</TableCell>
                                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'normal', color: '#455a64' }}>
                                        <Typography variant="caption">{row.descripcion}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default History;