export type MemberStatus = 'Active' | 'Inactive' | 'Suspended';
export type MembershipStatus = 'active' | 'expired';
export type MembershipPlan = 'monthly' | 'custom';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email?: string;
  phone?: string;
  startDate: string;
  renewalDate: string;
  membershipStatus: MembershipStatus;
  membershipPlan: MembershipPlan;
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateMemberData = Omit<
  Member,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type UpdateMemberData = Partial<CreateMemberData> & {
  status?: MemberStatus;
};

export interface SearchMemberByDniData {
  dni: string;
}

export interface RenewMembershipData {
  dni: string;
  renewalDate?: string;
  membershipPlan?: MembershipPlan;
}
