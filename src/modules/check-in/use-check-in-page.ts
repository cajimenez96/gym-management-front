import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useGetMembers } from '@/modules/member';
import { useCreateCheckIn, useGetCheckIns } from '@/modules/check-in';
import { useSnackbar } from '@/context';
import { useQueryClient } from '@tanstack/react-query';

export const useCheckInPage = () => {
  const queryClient = useQueryClient();

  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useGetMembers();
  const {
    data: checkIns = [],
    isLoading: isCheckInsLoading,
    isError: isCheckInsError,
  } = useGetCheckIns();
  const { mutate: performCheckInMutation, isPending: isCheckInPending } =
    useCreateCheckIn();
  const { showSnackbar } = useSnackbar();

  const isDataLoading = isCheckInsLoading || isMembersLoading;
  const isError = isMembersError || isCheckInsError;

  const checkInMember = (memberId: string) => {
    if (!memberId) {
      showSnackbar('ID de miembro inválido para el check-in.', 'error');
      console.error('Attempted check-in with invalid memberId');
      return;
    }

    performCheckInMutation(memberId, {
      onSuccess: () => {
        showSnackbar('¡Check-in registrado exitosamente!', 'success');
        queryClient.invalidateQueries({ queryKey: ['checkIns'] });
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || error.message || 'Falló el registro del check-in.';
        showSnackbar(message, 'error');
      },
    });
  };

  const filteredCheckIns = checkIns;

  return {
    checkInMember,
    filteredCheckIns,
    isCheckInPending,
    isDataLoading,
    isError,
    members,
  };
};
