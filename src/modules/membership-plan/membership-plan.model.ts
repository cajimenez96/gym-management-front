export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export type CreateMembershipPlanData = Omit<
  MembershipPlan,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateMembershipPlanData = Partial<CreateMembershipPlanData>;
