export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  status: string;
}

export interface PaymentWithMember extends Payment {
  memberName: string;
}
