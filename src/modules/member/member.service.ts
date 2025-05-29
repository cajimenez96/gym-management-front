import {
  CreateMemberData,
  Member,
  UpdateMemberData,
  MemberRepository,
  MemberCheckInInfoDto,
  MembershipStatus
} from '@/modules/member';

export class MemberService {
  private memberRepository: MemberRepository;

  constructor(memberRepository: MemberRepository = new MemberRepository()) {
    this.memberRepository = memberRepository;
  }

  async getMembers(): Promise<Member[]> {
    return this.memberRepository.getAll();
  }

  async getMember(id: string): Promise<Member | null> {
    return this.memberRepository.getById(id);
  }

  async createMember(memberData: CreateMemberData): Promise<Member> {
    return this.memberRepository.create(memberData);
  }

  async updateMember(
    id: string,
    memberData: UpdateMemberData,
  ): Promise<Member | null> {
    return this.memberRepository.update(id, memberData);
  }

  async deleteMember(id: string): Promise<boolean> {
    try {
      await this.memberRepository.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting member:', error);
      return false;
    }
  }

  async getMembershipStatus(memberId: string): Promise<MembershipStatus> {
    const member = await this.memberRepository.getById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }
    return member.membershipStatus;
  }

  async updateMembershipStatus(
    memberId: string,
    status: MembershipStatus,
  ): Promise<boolean> {
    try {
      await this.memberRepository.update(memberId, { membershipStatus: status });
      return true;
    } catch (error) {
      console.error('Error updating member status:', error);
      return false;
    }
  }

  async getMemberCheckInInfoByDni(dni: string): Promise<MemberCheckInInfoDto> {
    return this.memberRepository.getCheckInInfoByDni(dni);
  }
}
