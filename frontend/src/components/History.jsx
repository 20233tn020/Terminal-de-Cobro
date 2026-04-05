import React, { useEffect, useState } from 'react';
import { Box, Typography, Card } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const History = () => {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/historial/historial"); // 🔥 sin tarjeta
                const data = await res.json();

                if (data.status) {
                    setHistory(data.historial);
                } else {
                    setHistory([]);
                }

            } catch (err) {
                setError("Error al conectar");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <Box>

            <Typography variant="h4" color="#070825" fontWeight="bold" mb={3}>
                Registro de Operaciones
            </Typography>

            {/* 🔥 depende del servidor si tarda en contestar... */}
            {loading && <p>Cargando...</p>}

            {/* 🔥 mostrar alertas de error  */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* 🔥 */}
            {!loading && history.length === 0 && (
                <Card sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
                    <HistoryIcon sx={{ fontSize: 80, color: '#b0bec5', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Bitácora de movimientos realizados por ti en el turno actual.
                    </Typography>
                </Card>
            )}

            {/* 🔥 si hay hisrotia, va mostrar */}
            {history.length > 0 && (
                <Card sx={{ p: 3, borderRadius: 4 }}>
                    <table border="1" width="100%" cellPadding="10" >
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                        </tr>
                        </thead>

                        <tbody>
                        {history.map((item, index) => (
                            <tr key={index}>
                                <td>{item.nombre}</td>
                                <td>{item.tipo}</td>
                                <td>${item.monto}</td>
                                <td>{item.descripcion}</td>
                                <td>{new Date(item.fecha).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Card>
            )}

        </Box>
    );
};

export default History;