import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import { useCheckInPage } from './use-check-in-page';
import { LoadingAnimation } from '@/components';
import { CheckIn } from '@/check-in';
import { Member } from '@/member';
import { format, parseISO } from 'date-fns';

const MemberSelect: React.FC<{
  selectedMemberId: string;
  onMemberChange: (event: SelectChangeEvent) => void;
  members: Member[];
}> = ({ selectedMemberId, onMemberChange, members }) => (
  <FormControl fullWidth sx={{ mr: 1 }}>
    <InputLabel id="member-select-label">Select Member</InputLabel>
    <Select
      labelId="member-select-label"
      id="member-select"
      value={selectedMemberId}
      label="Select Member"
      onChange={onMemberChange}
      variant="outlined"
    >
      {members.map((member) => (
        <MenuItem key={member.id} value={member.id}>
          {`${member.firstName} ${member.lastName}`}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const CheckInTable: React.FC<{ checkIns: CheckIn[]; isMobile: boolean }> = ({
  checkIns,
  isMobile,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader aria-label="check-in table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              {!isMobile && <TableCell>Email</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {checkIns
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((checkIn) => (
                <TableRow key={checkIn.id} hover>
                  <TableCell>
                    {format(parseISO(checkIn.dateTime), 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(checkIn.dateTime), 'HH:mm')}
                  </TableCell>
                  <TableCell>{checkIn.member.firstName}</TableCell>
                  <TableCell>{checkIn.member.lastName}</TableCell>
                  {!isMobile && <TableCell>{checkIn.member.email}</TableCell>}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={checkIns.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

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
        <MemberSelect
          selectedMemberId={selectedMemberId}
          onMemberChange={handleMemberChange}
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
