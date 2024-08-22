export type MemberStatus = 'Active' | 'Inactive' | 'Suspended';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
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
