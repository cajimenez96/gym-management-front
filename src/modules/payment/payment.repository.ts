import { MEMBERS_URL, PAYMENTS_URL, apiClient } from '@/api-client.ts';
import { AxiosInstance } from 'axios';
import { Payment, PaymentWithMember } from '@/modules/payment';
import { Member } from '@/modules/member';

export class PaymentRepository {
  private readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = apiClient;
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
    const response = await this.apiClient.post<{
      clientSecret: string;
      paymentIntentId: string;
    }>(`${PAYMENTS_URL}/initiate`, { amount, memberId, planId });
    return response.data;
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    await this.apiClient.post(`${PAYMENTS_URL}/confirm/${paymentIntentId}`);
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
    const response = await this.apiClient.post<Payment>(`${PAYMENTS_URL}/manual`, {
      memberId,
      planId,
      amount,
      paymentMethod,
      notes,
    });
    return response.data;
  }

  async getPaymentHistory(): Promise<Payment[]> {
    const response = await this.apiClient.get<Payment[]>(`${PAYMENTS_URL}`);
    return response.data;
  }

  async getPaymentsWithMembers(): Promise<PaymentWithMember[]> {
    const [paymentsResponse, membersResponse] = await Promise.all([
      this.apiClient.get<Payment[]>(`${PAYMENTS_URL}`),
      this.apiClient.get<Member[]>(MEMBERS_URL),
    ]);

    const memberMap = new Map(
      membersResponse.data.map((member) => [
        member.id,
        `${member.firstName} ${member.lastName}`,
      ]),
    );

    return paymentsResponse.data.map((payment) => ({
      ...payment,
      memberName: memberMap.get(payment.memberId) || 'Unknown Member',
    }));
  }
}
