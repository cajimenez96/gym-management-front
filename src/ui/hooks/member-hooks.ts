import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/ui/context';
import { CreateMemberData, Member, UpdateMemberData } from '@/core/entities';
import { ApiMemberRepository } from '@/core/repositories';
import { MemberServiceImpl } from '@/core/services';

const memberRepository = new ApiMemberRepository();
const memberService = new MemberServiceImpl(memberRepository);

export const useRegisterMember = () => {
  const queryClient = useQueryClient();

  return useMutation<Member, Error, CreateMemberData>({
    mutationFn: (data: CreateMemberData) => memberService.createMember(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
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
