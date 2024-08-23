import { CHECK_INS_URL, apiClient } from '@/api-client.ts';
import { CheckIn } from '@/modules/check-in';
import { AxiosInstance } from 'axios';

export class CheckInRepository {
  private readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = apiClient;
  }

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
