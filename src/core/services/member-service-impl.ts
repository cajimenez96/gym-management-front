import {
  CreateMemberData,
  Member,
  MemberStatus,
  UpdateMemberData,
} from '@/core/entities';
import { ApiMemberRepository } from '@/core/repositories';

export class MemberServiceImpl {
  private memberRepository: ApiMemberRepository;

  constructor(
    memberRepository: ApiMemberRepository = new ApiMemberRepository(),
  ) {
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

  async getMembershipStatus(memberId: string): Promise<MemberStatus> {
    const member = await this.memberRepository.getById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }
    return member.status;
  }

  async updateMembershipStatus(
    memberId: string,
    status: MemberStatus,
  ): Promise<boolean> {
    try {
      await this.memberRepository.update(memberId, { status });
      return true;
    } catch (error) {
      console.error('Error updating member status:', error);
      return false;
    }
  }
}
