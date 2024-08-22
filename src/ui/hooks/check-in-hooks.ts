import { ApiCheckInRepository } from '@/core/repositories';
import { CheckInServiceImpl } from '@/core/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api-client';
import { CheckIn } from '@/core/entities';

const checkInRepository = new ApiCheckInRepository(apiClient);
const checkInService = new CheckInServiceImpl(checkInRepository);

export const useGetCheckIns = () => {
  return useQuery<CheckIn[], Error>({
    queryKey: ['checkIns'],
    queryFn: () => checkInService.getCheckIns(),
  });
};

export const useCreateCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation<CheckIn, Error, string>({
    mutationFn: (memberId: string) => checkInService.createCheckIn(memberId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['checkIns'] });
    },
  });
};
