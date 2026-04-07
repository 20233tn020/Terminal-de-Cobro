import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const History = () => {
  return (
    <Box>
      <Typography variant="h4" color="#070825" fontWeight="bold" mb={3}>Registro de Operaciones</Typography>
      <Card sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
        <HistoryIcon sx={{ fontSize: 80, color: '#b0bec5', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Bitácora de movimientos realizados por ti en el turno actual.</Typography>
      </Card>
    </Box>
  );
};

export default History;