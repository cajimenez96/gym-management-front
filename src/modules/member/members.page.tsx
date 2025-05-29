import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Member,
  MembershipStatus,
  UpdateMemberData,
  useDeleteMember,
  useGetMembers,
  useUpdateMember,
} from '@/modules/member';
import { useMembershipPlans, MembershipPlan } from '@/modules/membership-plan';
import { FormEvent, useState, useMemo } from 'react';
import { LoadingAnimation } from '@/components';

export function MembersPage() {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { mutate: updateMember } = useUpdateMember();
  const { mutate: deleteMember } = useDeleteMember();
  const { data: members = [], isLoading: isLoadingMembers, isError: isMembersError } = useGetMembers();
  const { data: membershipPlans = [], isLoading: isLoadingPlans, isError: isPlansError } = useMembershipPlans();

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
  };

  const handleEditClose = () => {
    setEditingMember(null);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMember(id);
    }
  };

  const handleUpdateMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember) return;

    const formData = new FormData(event.currentTarget);
    const memberData: UpdateMemberData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      membershipStatus: formData.get('status') as MembershipStatus,
      membershipPlanId: formData.get('membershipPlanId') as string | null,
    };
    updateMember({ id: editingMember.id, data: memberData });
    handleEditClose();
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'dni', headerName: 'DNI', width: 150 },
      {
        field: 'firstName',
        headerName: 'First Name',
        width: 200,
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        width: 200,
      },
      // { field: 'email', headerName: 'Email', width: 200 },
      // { field: 'phone', headerName: 'Phone', width: 150 },
      {
        field: 'membershipPlanId',
        headerName: 'Plan',
        width: 200,
        valueFormatter: (value: string | null) => {
          if (!value) return 'Sin plan';
          const plan = membershipPlans.find(p => p.id === value);
          return plan ? plan.name : 'Plan no encontrado';
        },
      },
      { field: 'status', headerName: 'Status', width: 200 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleEditClick(params.row)}
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeleteClick(params.row.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    [],
  );

  if (isLoadingMembers || isLoadingPlans) {
    return <LoadingAnimation />;
  }

  if (isMembersError || isPlansError) {
    return <Typography color="error">An error occurred while loading data.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Members
        </Typography>
      </Box>
      <DataGrid rows={members} columns={columns} autoHeight />

      <Dialog open={!!editingMember} onClose={handleEditClose}>
        <DialogTitle>Edit Member</DialogTitle>
        <form onSubmit={handleUpdateMember}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              defaultValue={editingMember?.firstName || ''}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              defaultValue={editingMember?.lastName || ''}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              defaultValue={editingMember?.email || ''}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone"
              type="tel"
              fullWidth
              defaultValue={editingMember?.phone || ''}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="membership-plan-label">Plan de Membresía</InputLabel>
              <Select
                labelId="membership-plan-label"
                name="membershipPlanId"
                defaultValue={editingMember?.membershipPlanId || ''}
                label="Plan de Membresía"
                variant="outlined"
              >
                <MenuItem value=""><em>Sin plan</em></MenuItem>
                {membershipPlans.map((plan: MembershipPlan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                defaultValue={editingMember?.membershipStatus || 'active'}
                label="Status"
                variant="outlined"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit">Update</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
