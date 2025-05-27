import { Container, Typography } from '@mui/material';
import { PaymentForm } from '@/modules/payment/payment-form.tsx';

export function PaymentsPage() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Registro Manual de Pago
      </Typography>
      <PaymentForm />
    </Container>
  );
}
