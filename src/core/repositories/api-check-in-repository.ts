import { CHECK_INS_URL } from '@/core/api-client';
import { CheckIn } from '@/core/entities';
import { AxiosInstance } from 'axios';

export class ApiCheckInRepository {
  constructor(private apiClient: AxiosInstance) {}

  async createCheckIn(memberId: string): Promise<CheckIn> {
    const response = await this.apiClient.post<CheckIn>(CHECK_INS_URL, {
      memberId,
    });
    return response.data;
  }

  async getCheckIns(): Promise<CheckIn[]> {
    const response = await this.apiClient.get<CheckIn[]>(CHECK_INS_URL);
    return response.data;
  }

  async getCheckInsByMemberId(memberId: string): Promise<CheckIn[]> {
    const response = await this.apiClient.get<CheckIn[]>(
      `${CHECK_INS_URL}?memberId=${memberId}`,
    );
    return response.data;
  }
}
