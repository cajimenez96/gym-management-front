import { useState, useMemo } from 'react';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LoadingAnimation, MembershipPlanDialog } from '@/components';
import {
  useDeleteMembershipPlan,
  useMembershipPlans,
  MembershipPlan,
} from '@/modules/membership-plan';

export function MembershipPlansPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const { data: plans = [], isLoading, isError } = useMembershipPlans();
  const deleteMutation = useDeleteMembershipPlan();
  const tableRows = plans.slice().sort((a, b) => a?.duration - b?.duration);

  const handleOpenDialog = (plan: MembershipPlan | null = null) => {
    setEditingPlan(plan);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingPlan(null);
    setOpenDialog(false);
  };

  const handleDeletePlan = (id: string) => {
    if (
      confirm(
        'All memberships linked to this plan will be deleted. Are you sure you want to delete this plan?',
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
      {
        field: 'duration',
        headerName: 'Duration (months)',
        flex: 1,
        width: 150,
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 100,
        flex: 1,
        valueFormatter: (value: number) => `$${value.toFixed(2)}`,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleOpenDialog(params.row)}
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeletePlan(params.row.id)}
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

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <Typography color="error">Error loading membership plans</Typography>
    );
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Membership Plans
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          Create New Plan
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <DataGrid rows={tableRows} columns={columns} autoHeight />
      </Box>
      {openDialog && (
        <MembershipPlanDialog
          open={openDialog}
          onClose={handleCloseDialog}
          plan={editingPlan}
        />
      )}
    </Box>
  );
}
