import { Box, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { usePaymentsWithMembers } from '@/modules/payment';
import { LoadingAnimation } from '@/components'; // Adjust the import path as needed

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Payment ID',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'memberName',
    headerName: 'Member Name',
    flex: 1,
    minWidth: 200,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 1,
    minWidth: 150,
    valueFormatter: (value) => {
      if (value == null) {
        return '';
      }
      const amount = value / 100;
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    minWidth: 150,
    valueFormatter: (value) => {
      if (value == null) {
        return '';
      }
      return new Date(value).toLocaleDateString();
    },
  },
  {
    field: 'status',
    headerName: 'Status',
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
          Error loading payments: {error.message}
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
          Payment History
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
