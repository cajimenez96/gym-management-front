import {
  Payment,
  PaymentWithMember,
  PaymentRepository,
} from '@/modules/payment';

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

  async createManualPayment({
    memberId,
    planId,
    amount,
    paymentMethod,
    notes,
  }: {
    memberId: string;
    planId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }): Promise<Payment> {
    return this.paymentRepository.createManualPayment({
      memberId,
      planId,
      amount,
      paymentMethod,
      notes,
    });
  }

  async getPaymentHistory(): Promise<Payment[]> {
    return this.paymentRepository.getPaymentHistory();
  }

  async getPaymentsWithMembers(): Promise<PaymentWithMember[]> {
    return this.paymentRepository.getPaymentsWithMembers();
  }
}
