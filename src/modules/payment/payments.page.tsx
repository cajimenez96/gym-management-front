import { Container, Typography } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSnackbar } from '@/context';
import { useEffect, useState } from 'react';
import { PaymentForm } from '@/modules/payment/payment-form.tsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export function PaymentsPage() {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      setStripeLoaded(true);
    } else {
      console.error(
        'Stripe publishable key is not set in environment variables',
      );
      showSnackbar(
        'Stripe configuration is missing. Please check your environment variables.',
        'error',
      );
    }
  }, [showSnackbar]);

  if (!stripeLoaded) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Error: Couldn't load the payment processor.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        One-Time Payment
      </Typography>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </Container>
  );
}
