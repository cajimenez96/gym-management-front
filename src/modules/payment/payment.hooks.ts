import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/stores/notification.store';
import {
  Payment,
  PaymentWithMember,
  PaymentService,
  PaymentRepository,
} from '@/modules/payment';

// Not sure why, but one day I started getting an error about using paymentRepository
// before it was initialized, and this solved the issue.
let paymentService: PaymentService | null = null;
const getPaymentService = () => {
  if (!paymentService) {
    const paymentRepository = new PaymentRepository();
    paymentService = new PaymentService(paymentRepository);
  }
  return paymentService;
};

export const useInitiatePayment = (
  onSuccess: (data: { clientSecret: string; paymentIntentId: string }) => void,
  onFailure: () => void,
) => {
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);
  return useMutation<
    { clientSecret: string; paymentIntentId: string },
    Error,
    { amount: number; memberId: string; planId: string }
  >({
    mutationFn: ({ amount, memberId, planId }) =>
      getPaymentService().initiatePayment({ amount, memberId, planId }),
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error) => {
      showSnackbar('Failed to initiate payment. Please try again.', 'error');
      console.error('Error initiating payment:', error);
      onFailure();
    },
  });
};

export const useConfirmPayment = () => {
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (paymentIntentId: string) =>
      getPaymentService().confirmPayment(paymentIntentId),
    onSuccess: async () => {
      showSnackbar('Payment successful!', 'success');
      await queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
    onError: (error) => {
      showSnackbar(
        'Payment confirmed but failed to update our records. Please contact support.',
        'error',
      );
      console.error('Error confirming payment:', error);
    },
  });
};

export const useCreateManualPayment = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Payment,
    Error,
    {
      memberId: string;
      planId: string;
      amount: number;
      paymentMethod: string;
      notes?: string;
    }
  >({
    mutationFn: (data) => getPaymentService().createManualPayment(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      await queryClient.invalidateQueries({ queryKey: ['paymentsWithMembers'] });
    },
    onError: (error) => {
      console.error('Error creating manual payment:', error);
    },
  });
};

export const usePaymentHistory = () => {
  return useQuery<Payment[], Error>({
    queryKey: ['paymentHistory'],
    queryFn: () => getPaymentService().getPaymentHistory(),
  });
};

export const usePaymentsWithMembers = () => {
  return useQuery<PaymentWithMember[], Error>({
    queryKey: ['paymentsWithMembers'],
    queryFn: () => getPaymentService().getPaymentsWithMembers(),
  });
};
