export interface CheckIn {
  id: string;
  memberId: string;
  dateTime: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
