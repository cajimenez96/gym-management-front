import { MEMBERS_URL, apiClient } from '@/api-client.ts';
import { 
  CreateMemberData, 
  Member, 
  UpdateMemberData,
  SearchMemberByDniData,
  RenewMembershipData,
  MemberCheckInInfoDto
} from '@/modules/member';
import { AxiosInstance } from 'axios';

export class MemberRepository {
  private readonly apiClient: AxiosInstance;

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

  // NEW MVP API ENDPOINTS

  // Search member by DNI (Owner + Admin access)
  async findByDni(dni: string): Promise<Member | null> {
    try {
      const response = await this.apiClient.get<Member>(`${MEMBERS_URL}/dni/${dni}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Member not found
      }
      throw error;
    }
  }

  // Renew membership by DNI (Owner only)
  async renewMembership(renewData: RenewMembershipData): Promise<Member> {
    const response = await this.apiClient.patch<Member>(
      `${MEMBERS_URL}/${renewData.dni}/renew`,
      {
        renewalDate: renewData.renewalDate,
        membershipPlanId: renewData.membershipPlanId
      }
    );
    return response.data;
  }

  // Get active members only (Owner + Admin access)
  async getActiveMembers(): Promise<Member[]> {
    const response = await this.apiClient.get<Member[]>(`${MEMBERS_URL}/active`);
    return response.data;
  }

  // Get expired members only (Owner only)
  async getExpiredMembers(): Promise<Member[]> {
    const response = await this.apiClient.get<Member[]>(`${MEMBERS_URL}/expired`);
    return response.data;
  }

  // Update all member statuses based on expiration dates (Owner only)
  async updateMemberStatuses(): Promise<{ message: string }> {
    const response = await this.apiClient.post<{ message: string }>(`${MEMBERS_URL}/update-statuses`);
    return response.data;
  }

  async getCheckInInfoByDni(dni: string): Promise<MemberCheckInInfoDto> {
    try {
      const response = await this.apiClient.get<MemberCheckInInfoDto>(`${MEMBERS_URL}/check-in-info/${dni}`);
      return response.data;
    } catch (error: any) {
      // Siempre relanzar el error para que React Query lo maneje y lo ponga en el estado 'error' del hook.
      // El console.error aquí es opcional, ya que el hook o el componente que lo usa pueden manejar el loggeo.
      // console.error('Error fetching check-in info by DNI in repository:', error.response?.data || error.message);
      throw error; 
    }
  }
}
