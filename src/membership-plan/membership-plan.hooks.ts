import {
  MembershipPlanRepository,
  MembershipPlan,
  CreateMembershipPlanData,
  UpdateMembershipPlanData,
  MembershipPlanService,
} from '@/membership-plan/index.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/context';

const membershipPlanRepository = new MembershipPlanRepository();
const membershipPlanService = new MembershipPlanService(
  membershipPlanRepository,
);

export const useMembershipPlans = () => {
  return useQuery<MembershipPlan[], Error>({
    queryKey: ['membershipPlans'],
    queryFn: () => membershipPlanService.getAllMembershipPlans(),
  });
};

export const useCreateMembershipPlan = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<MembershipPlan, Error, CreateMembershipPlanData>({
    mutationFn: (newPlan) =>
      membershipPlanService.createMembershipPlan(newPlan),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      showSnackbar('Membership plan created successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar(
        'Failed to create membership plan. Please try again.',
        'error',
      );
      console.error('Error creating membership plan:', error);
    },
  });
};

export const useUpdateMembershipPlan = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<
    MembershipPlan,
    Error,
    { id: string; plan: UpdateMembershipPlanData }
  >({
    mutationFn: ({ id, plan }) =>
      membershipPlanService.updateMembershipPlan(id, plan),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      showSnackbar('Membership plan updated successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar(
        'Failed to update membership plan. Please try again.',
        'error',
      );
      console.error('Error updating membership plan:', error);
    },
  });
};

export const useDeleteMembershipPlan = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<void, Error, string>({
    mutationFn: (id) => membershipPlanService.deleteMembershipPlan(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
      showSnackbar('Membership plan deleted successfully!', 'success');
    },
    onError: (error) => {
      showSnackbar(
        'Failed to delete membership plan. Please try again.',
        'error',
      );
      console.error('Error deleting membership plan:', error);
    },
  });
};
