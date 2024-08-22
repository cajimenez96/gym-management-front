import { CheckIn, CheckInRepository } from '@/check-in';

export class CheckInServiceImpl {
  private checkInRepository: CheckInRepository;

  constructor(checkInRepository: CheckInRepository) {
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
