import { Payment, PaymentWithMember, PaymentRepository } from '@/payment';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async initiatePayment({
    amount,
    memberId,
    planId,
  }: {
    amount: number;
    memberId: string;
    planId: string;
  }): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    return this.paymentRepository.initiatePayment({ amount, memberId, planId });
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    await this.paymentRepository.confirmPayment(paymentIntentId);
  }

  async getPaymentHistory(): Promise<Payment[]> {
    return this.paymentRepository.getPaymentHistory();
  }

  async getPaymentsWithMembers(): Promise<PaymentWithMember[]> {
    return this.paymentRepository.getPaymentsWithMembers();
  }
}
