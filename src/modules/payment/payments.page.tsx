import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { LoadingAnimation } from '@/components';
import { useSnackbar } from '@/context';
import React, { useEffect, useState } from 'react';
import { useGetMembers } from '@/modules/member';
import { useMembershipPlans } from '@/modules/membership-plan';
import { useConfirmPayment, useInitiatePayment } from '@/modules/payment';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [memberId, setMemberId] = useState('');
  const [planId, setPlanId] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { showSnackbar } = useSnackbar();
  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useGetMembers();
  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isError: isPlansError,
  } = useMembershipPlans();

  const isLoading = isMembersLoading || isPlansLoading;
  const isError = isMembersError || isPlansError;
  const submitPaymentButtonDisabled =
    isProcessingPayment || isMembersLoading || !memberId || !planId;
  const confirmPaymentMutation = useConfirmPayment();
  const initiatePaymentMutation = useInitiatePayment(
    async (data) => {
      if (!stripe || !elements) {
        throw new Error('Stripe has not loaded');
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result?.error) {
        showSnackbar(result.error.message || 'Payment failed', 'error');
        setIsProcessingPayment(false);
      } else if (result?.paymentIntent.status === 'succeeded') {
        confirmPaymentMutation.mutate(data.paymentIntentId, {
          onSuccess: () => {
            setMemberId('');
            setPlanId('');
            elements?.getElement(CardElement)?.clear();
          },
          onSettled: () => setIsProcessingPayment(false),
        });
      }
    },
    () => setIsProcessingPayment(false),
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      showSnackbar('Stripe has not loaded', 'error');
      return;
    }

    if (!memberId) {
      showSnackbar('Please select a Member', 'error');
      return;
    }

    setIsProcessingPayment(true);
    initiatePaymentMutation.mutate({
      amount: Math.round(parseFloat(planPrice) * 100), // Convert to cents
      memberId,
      planId,
    });
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return <Typography color="error">Error loading payment page</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <FormControl required fullWidth margin="normal">
          <InputLabel id="member-select-label">Select Member</InputLabel>
          <Select
            labelId="member-select-label"
            id="member-select"
            value={memberId}
            label="Select Member"
            onChange={(e) => setMemberId(e.target.value)}
            disabled={isMembersLoading}
            variant="outlined"
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {`${member.firstName} ${member.lastName}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl required fullWidth margin="normal">
          <InputLabel id="plan-select-label">Select Plan</InputLabel>
          <Select
            labelId="plan-select-label"
            id="plan-select"
            value={planId}
            label="Select Plan"
            onChange={(e) => {
              const plan = plans.find((p) => p.id === e.target.value);
              if (plan) {
                setPlanId(e.target.value);
                setPlanPrice(plan.price.toString());
              }
            }}
            disabled={isPlansLoading}
            variant="outlined"
          >
            {plans
              .sort((a, b) => a.duration - b.duration)
              .map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          disabled
          label="Amount"
          variant="outlined"
          fullWidth
          type="number"
          value={planId ? planPrice : ''}
          margin="normal"
          InputProps={{ startAdornment: '$' }}
        />
        <Box sx={{ mb: 2, mt: 2 }}>
          <CardElement
            options={{
              style: { base: { fontSize: '16px' } },
              hidePostalCode: true,
            }}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={submitPaymentButtonDisabled}
        >
          {isProcessingPayment ? <CircularProgress size={24} /> : 'Pay'}
        </Button>
      </form>
    </Paper>
  );
};

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
          Error: Stripe configuration is missing. Please check your environment
          variables.
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
