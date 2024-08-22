import { CheckIn } from '@/core/entities';
import { ApiCheckInRepository } from '@/core/repositories';

export class CheckInServiceImpl {
  private checkInRepository: ApiCheckInRepository;

  constructor(checkInRepository: ApiCheckInRepository) {
    this.checkInRepository = checkInRepository;
  }

  async createCheckIn(memberId: string): Promise<CheckIn> {
    return this.checkInRepository.createCheckIn(memberId);
  }

  async getCheckIns(): Promise<CheckIn[]> {
    return this.checkInRepository.getCheckIns();
  }

  async getCheckInsByMemberId(memberId: string): Promise<CheckIn[]> {
    return this.checkInRepository.getCheckInsByMemberId(memberId);
  }
}
