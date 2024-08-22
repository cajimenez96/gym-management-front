import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/context';
import {
  CreateMemberData,
  Member,
  UpdateMemberData,
  MemberRepository,
  MemberService,
} from '@/modules/member';

const memberRepository = new MemberRepository();
const memberService = new MemberService(memberRepository);

export const useRegisterMember = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<Member, Error, CreateMemberData>({
    mutationFn: (data: CreateMemberData) => memberService.createMember(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      showSnackbar('Member registered successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar('Failed to register member.', 'error');
      console.error('Error registering member:', error);
    },
  });
};

export const useGetMembers = () => {
  return useQuery<Member[], Error>({
    queryKey: ['members'],
    queryFn: () => memberService.getMembers(),
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<
    Member | null,
    Error,
    { id: string; data: UpdateMemberData }
  >({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      showSnackbar('Member updated successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar('Failed to update member. Please try again.', 'error');
      console.error('Error updating member:', error);
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: string) => memberService.deleteMember(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      showSnackbar('Member deleted successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar('Failed to delete member. Please try again.', 'error');
      console.error('Error delete member:', error);
    },
  });
};
