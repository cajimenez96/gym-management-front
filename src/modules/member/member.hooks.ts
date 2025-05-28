import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/stores/notification.store';
import {
  CreateMemberData,
  Member,
  UpdateMemberData,
  SearchMemberByDniData,
  RenewMembershipData,
  MemberRepository,
  MemberService,
  MemberCheckInInfoDto,
} from '@/modules/member';

const memberRepository = new MemberRepository();
const memberService = new MemberService(memberRepository);

export const useRegisterMember = () => {
  const queryClient = useQueryClient();
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);

  return useMutation<Member, Error, CreateMemberData>({
    mutationFn: (data: CreateMemberData) => memberService.createMember(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'active'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'expired'] });
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
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);

  return useMutation<
    Member | null,
    Error,
    { id: string; data: UpdateMemberData }
  >({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'active'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'expired'] });
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
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);
  return useMutation({
    mutationFn: (id: string) => memberService.deleteMember(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'active'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'expired'] });
      showSnackbar('Member deleted successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar('Failed to delete member. Please try again.', 'error');
      console.error('Error delete member:', error);
    },
  });
};

export const useSearchMemberByDni = (dni: string, enabled = true) => {
  return useQuery<Member | null, Error>({
    queryKey: ['members', 'dni', dni],
    queryFn: () => memberRepository.findByDni(dni),
    enabled: enabled && dni.length > 0,
    staleTime: 30000,
  });
};

export const useRenewMembership = () => {
  const queryClient = useQueryClient();
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);

  return useMutation<Member, Error, RenewMembershipData>({
    mutationFn: (renewData: RenewMembershipData) => memberRepository.renewMembership(renewData),
    onSuccess: async (updatedMember) => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'active'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'expired'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'dni', updatedMember.dni] });
      
      showSnackbar(`Membership renewed successfully for DNI: ${updatedMember.dni}`, 'success');
    },
    onError: (error) => {
      showSnackbar('Failed to renew membership. Please try again.', 'error');
      console.error('Error renewing membership:', error);
    },
  });
};

export const useGetActiveMembers = () => {
  return useQuery<Member[], Error>({
    queryKey: ['members', 'active'],
    queryFn: () => memberRepository.getActiveMembers(),
    staleTime: 60000,
  });
};

export const useGetExpiredMembers = () => {
  return useQuery<Member[], Error>({
    queryKey: ['members', 'expired'],
    queryFn: () => memberRepository.getExpiredMembers(),
    staleTime: 60000,
  });
};

export const useUpdateMemberStatuses = () => {
  const queryClient = useQueryClient();
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);

  return useMutation<{ message: string }, Error>({
    mutationFn: () => memberRepository.updateMemberStatuses(),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'active'] });
      await queryClient.invalidateQueries({ queryKey: ['members', 'expired'] });
      
      showSnackbar(response.message || 'Member statuses updated successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar('Failed to update member statuses. Please try again.', 'error');
      console.error('Error updating member statuses:', error);
    },
  });
};

export const useGetMemberCheckInInfoByDni = (dni: string | null, options?: { enabled?: boolean }) => {
  return useQuery<MemberCheckInInfoDto, Error>(
    {
      queryKey: ['memberCheckInInfo', dni],
      queryFn: async () => {
        if (!dni) {
          return Promise.reject(new Error('DNI no puede ser nulo para la búsqueda.'));
        }
        return memberService.getMemberCheckInInfoByDni(dni);
      },
      enabled: options?.enabled !== undefined ? options.enabled && !!dni : !!dni,
      retry: (failureCount, error: any) => {
        if (error.response?.status === 404) {
          return false;
        }
        return failureCount < 2;
      },
    }
  );
};
