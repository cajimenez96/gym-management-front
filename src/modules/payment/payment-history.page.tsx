import { Box, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { usePaymentsWithMembers } from '@/modules/payment';
import { LoadingAnimation } from '@/components'; // Adjust the import path as needed

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID de Pago',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'memberName',
    headerName: 'Nombre del Miembro',
    flex: 1,
    minWidth: 200,
  },
  {
    field: 'amount',
    headerName: 'Monto',
    flex: 1,
    minWidth: 150,
    valueFormatter: (value) => {
      if (value == null) {
        return '';
      }
      const amount = value / 100; // Assuming value is in cents
      return amount.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
  {
    field: 'date',
    headerName: 'Fecha',
    flex: 1,
    minWidth: 150,
    valueFormatter: (value) => {
      if (value == null) {
        return '';
      }
      return new Date(value).toLocaleDateString('es-ES');
    },
  },
  {
    field: 'status',
    headerName: 'Estado',
    flex: 1,
    minWidth: 150,
  },
];

export function PaymentHistoryPage() {
  const { data: rowData = [], isLoading, error } = usePaymentsWithMembers();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Typography color="error" variant="h6">
          Error al cargar los pagos: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth={false}
        sx={{ mt: 4, mb: 4, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant="h4" gutterBottom component="h1">
          Historial de Pagos
        </Typography>
        <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
          <DataGrid
            rows={rowData}
            columns={columns}
            pagination
            checkboxSelection={false}
            autoHeight
          />
        </Box>
      </Container>
    </Box>
  );
}
