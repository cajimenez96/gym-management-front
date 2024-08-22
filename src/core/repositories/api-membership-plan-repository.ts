import { MEMBERSHIP_PLANS_URL, apiClient } from '@/core/api-client';
import {
  CreateMembershipPlanData,
  MembershipPlan,
  UpdateMembershipPlanData,
} from '@/core/entities';
import { AxiosInstance } from 'axios';

export class ApiMembershipPlanRepository {
  private apiClient: AxiosInstance;

  constructor(apiClientInstance: AxiosInstance = apiClient) {
    this.apiClient = apiClientInstance;
  }

  async getAll(): Promise<MembershipPlan[]> {
    const response =
      await this.apiClient.get<MembershipPlan[]>(MEMBERSHIP_PLANS_URL);
    return response.data;
  }

  async create(plan: CreateMembershipPlanData): Promise<MembershipPlan> {
    const response = await this.apiClient.post<MembershipPlan>(
      MEMBERSHIP_PLANS_URL,
      plan,
    );
    return response.data;
  }

  async update(
    id: string,
    plan: UpdateMembershipPlanData,
  ): Promise<MembershipPlan> {
    const response = await this.apiClient.patch<MembershipPlan>(
      `${MEMBERSHIP_PLANS_URL}/${id}`,
      plan,
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`${MEMBERSHIP_PLANS_URL}/${id}`);
  }
}
