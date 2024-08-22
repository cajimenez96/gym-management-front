import { MEMBERS_URL, apiClient } from '@/core/api-client';
import { CreateMemberData, Member, UpdateMemberData } from '@/core/entities';
import { AxiosInstance } from 'axios';

export class ApiMemberRepository {
  apiClient: AxiosInstance;

  constructor() {
    this.apiClient = apiClient;
  }

  async getAll(): Promise<Member[]> {
    const response = await this.apiClient.get<Member[]>(MEMBERS_URL);
    return response.data;
  }

  async getById(id: string): Promise<Member | null> {
    const response = await this.apiClient.get<Member>(`${MEMBERS_URL}/${id}`);
    return response.data;
  }

  async create(member: CreateMemberData): Promise<Member> {
    const response = await this.apiClient.post<Member>(MEMBERS_URL, member);
    return response.data;
  }

  async update(id: string, member: UpdateMemberData): Promise<Member> {
    const response = await this.apiClient.patch<Member>(
      `${MEMBERS_URL}/${id}`,
      member,
    );
    return response.data;
  }

  async delete(id: string): Promise<Member> {
    const response = await this.apiClient.delete(`${MEMBERS_URL}/${id}`);
    return response.data;
  }
}
