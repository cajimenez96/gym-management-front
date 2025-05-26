import React, { useState } from 'react';
import { useSnackbar } from '@/context';
import { useGetMembers } from '@/modules/member';
import { useMembershipPlans } from '@/modules/membership-plan';
import { useCreateManualPayment } from '@/modules/payment/payment.hooks.ts';
import { LoadingAnimation } from '@/components';
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';

export function PaymentForm() {
  const [memberId, setMemberId] = useState('');
  const [planId, setPlanId] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
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
    isProcessingPayment || isMembersLoading || !memberId || !planId || !paymentMethod;

  const createPaymentMutation = useCreateManualPayment();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!memberId) {
      showSnackbar('Please select a Member', 'error');
      return;
    }

    if (!planId) {
      showSnackbar('Please select a Plan', 'error');
      return;
    }

    if (!paymentMethod) {
      showSnackbar('Please select a Payment Method', 'error');
      return;
    }

    setIsProcessingPayment(true);
    createPaymentMutation.mutate({
      memberId,
      planId,
      amount: parseFloat(planPrice),
      paymentMethod,
      notes: notes.trim() || undefined,
    }, {
      onSuccess: () => {
        setMemberId('');
        setPlanId('');
        setPlanPrice('');
        setPaymentMethod('');
        setNotes('');
        showSnackbar('Payment registered successfully!', 'success');
      },
      onError: (error: any) => {
        showSnackbar(error.message || 'Failed to register payment', 'error');
      },
      onSettled: () => setIsProcessingPayment(false),
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
        <FormControl required fullWidth margin="normal">
          <InputLabel id="payment-method-label">Payment Method</InputLabel>
          <Select
            labelId="payment-method-label"
            id="payment-method-select"
            value={paymentMethod}
            label="Payment Method"
            onChange={(e) => setPaymentMethod(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="card">Card (Manual)</MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            <MenuItem value="check">Check</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Notes (Optional)"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          margin="normal"
          placeholder="Additional payment information, reference numbers, etc."
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={submitPaymentButtonDisabled}
          sx={{ mt: 2 }}
        >
          {isProcessingPayment ? <CircularProgress size={24} /> : 'Register Payment'}
        </Button>
      </form>
    </Paper>
  );
}
