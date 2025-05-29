import { MEMBERS_MATCHER } from '@/test-utils';
import { MEMBERS_URL } from '@/api-client';
import { Member, UpdateMemberData } from '@/modules/member';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

let mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    dni: '11111111',
    startDate: '2023-01-01T00:00:00Z',
    renewalDate: '2024-01-01T00:00:00Z',
    membershipStatus: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    dni: '22222222',
    startDate: '2023-01-01T00:00:00Z',
    renewalDate: '2023-02-01T00:00:00Z',
    membershipStatus: 'expired',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

export const viewAllMembersPageServer = setupServer(
  http.get(MEMBERS_MATCHER, () => {
    return HttpResponse.json(mockMembers);
  }),
  http.patch(`*${MEMBERS_URL}/:id`, async ({ request, params }) => {
    const updatedMember = (await request.json()) as UpdateMemberData;
    const { id } = params;
    const index = mockMembers.findIndex((member) => member.id === id);
    if (index !== -1) {
      mockMembers[index] = { ...mockMembers[index], ...updatedMember };
      return HttpResponse.json(mockMembers[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),
  http.delete(`*${MEMBERS_URL}/:id`, ({ params }) => {
    const { id } = params;
    mockMembers = mockMembers.filter((member) => member.id !== id);
    return HttpResponse.json({ message: 'Member deleted successfully' });
  }),
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return new HttpResponse(null, { status: 404 });
  }),
);
