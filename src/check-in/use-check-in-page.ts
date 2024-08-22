import { SelectChangeEvent } from '@mui/material';
import {
  useCreateCheckIn,
  useGetCheckIns,
  useGetMembers,
  useSnackbar,
} from '@/ui/hooks';
import { useState } from 'react';

export const useCheckInPage = () => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
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
  const { mutate: checkInMemberMutation, isPending: isCheckInPending } =
    useCreateCheckIn();
  const { showSnackbar } = useSnackbar();

  const isDataLoading = isCheckInsLoading || isMembersLoading;
  const isError = isMembersError || isCheckInsError;

  const checkInMember = () => {
    if (!selectedMemberId) {
      return;
    }

    checkInMemberMutation(selectedMemberId, {
      onSuccess: () => {
        showSnackbar('Check-in successful!', 'success');
      },
      onError: () => {
        showSnackbar('Check-in failed', 'error');
      },
    });
  };

  const filteredCheckIns = selectedMemberId
    ? checkIns.filter((checkIn) => checkIn.memberId === selectedMemberId)
    : checkIns;

  const handleMemberChange = (event: SelectChangeEvent) => {
    const memberId = event.target.value;
    setSelectedMemberId(memberId);
    const selectedMember = members.find((member) => member.id === memberId);
    if (selectedMember && selectedMember.status !== 'Active') {
      showSnackbar('Warning: The selected member is not active.', 'warning');
    }
  };

  return {
    checkInMember,
    filteredCheckIns,
    handleMemberChange,
    isCheckInPending,
    isDataLoading,
    isError,
    members,
    selectedMemberId,
  };
};
