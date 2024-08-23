import React from 'react';
import {
  Box,
  Button,
  FormControl,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useCheckInPage } from './use-check-in-page.ts';
import { LoadingAnimation } from '@/components';
import { CheckIn } from '@/modules/check-in';
import { Member } from '@/modules/member';
import { format, parseISO } from 'date-fns';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface SearchableMemberSelectProps {
  selectedMemberId: string;
  onMemberChange: (memberId: string) => void;
  members: Member[];
}

export const SearchableMemberSelect: React.FC<SearchableMemberSelectProps> = ({
  selectedMemberId,
  onMemberChange,
  members,
}) => {
  const handleChange = (_: React.SyntheticEvent, value: Member | null) => {
    if (value) {
      onMemberChange(value.id);
    }
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        id="member-select-autocomplete"
        options={members}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        renderInput={(params) => (
          <TextField {...params} label="Select Member" />
        )}
        value={members.find((member) => member.id === selectedMemberId) || null}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </FormControl>
  );
};

function CheckInTable({
  checkIns,
  isMobile,
}: {
  checkIns: CheckIn[];
  isMobile: boolean;
}) {
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 110,
      valueGetter: (_, row) => format(parseISO(row.dateTime), 'yyyy-MM-dd'),
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 110,
      valueGetter: (_, row) => format(parseISO(row.dateTime ?? ''), 'HH:mm'),
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
      valueGetter: (_, row) => row.member.firstName,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 130,
      valueGetter: (_, row) => row.member.lastName,
    },
  ];

  if (!isMobile) {
    columns.push({
      field: 'email',
      headerName: 'Email',
      width: 200,
      valueGetter: (_, row) => row.member.email,
    });
  }

  return (
    <Paper sx={{ width: '100%', height: 'calc(100vh - 300px)' }}>
      <DataGrid
        rows={checkIns}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection={false}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}

export function CheckInPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    checkInMember,
    filteredCheckIns,
    handleMemberChange,
    isCheckInPending,
    isDataLoading,
    isError,
    members,
    selectedMemberId,
  } = useCheckInPage();

  if (isDataLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return <Typography>An error occurred</Typography>;
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Gym Check-In System
      </Typography>
      <Box sx={{ mb: 2 }}>
        <SearchableMemberSelect
          selectedMemberId={selectedMemberId}
          onMemberChange={(memberId) =>
            handleMemberChange({
              target: { value: memberId },
            } as SelectChangeEvent)
          }
          members={members}
        />
        <Button
          variant="contained"
          onClick={checkInMember}
          disabled={isCheckInPending || !selectedMemberId}
          sx={{ mt: 2, width: '100%' }}
        >
          Check In
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <CheckInTable checkIns={filteredCheckIns} isMobile={isMobile} />
      </Box>
    </Box>
  );
}
