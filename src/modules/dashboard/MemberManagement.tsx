import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Member,
  MembershipStatus,
  CreateMemberData,
  UpdateMemberData,
  useGetMembers,
  useRegisterMember,
  useUpdateMember,
  useDeleteMember,
  useUpdateMemberStatuses,
} from '@/modules/member';
import {
  useMembershipPlans,
} from '@/modules/membership-plan';
import { LoadingAnimation } from '@/components';
import { useNotificationStore } from '@/stores/notification.store';

interface MemberManagementProps {
  onMemberSelect?: (member: Member) => void;
}

export function MemberManagement({ onMemberSelect }: MemberManagementProps) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<MembershipStatus | 'all'>('all');

  const { data: members = [], isLoading: isLoadingMembers, isError: isErrorMembers, refetch } = useGetMembers();
  const { data: membershipPlans = [], isLoading: isLoadingPlans, isError: isErrorPlans } = useMembershipPlans();
  
  const { mutate: createMember, isPending: isCreating } = useRegisterMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: updateStatuses, isPending: isUpdatingStatuses } = useUpdateMemberStatuses();
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);

  const filteredMembers = useMemo(() => {
    let currentMembers = members;
    if (searchFilter) {
      currentMembers = currentMembers.filter(
        (member) =>
          member.dni.toLowerCase().includes(searchFilter.toLowerCase()) ||
          member.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      currentMembers = currentMembers.filter((member) => member.membershipStatus === statusFilter);
    }
    return currentMembers;
  }, [members, searchFilter, statusFilter]);

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
  };

  const handleEditClose = () => {
    setEditingMember(null);
  };

  const handleDeleteClick = async (id: string, dni: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el miembro con DNI ${dni}?`)) {
      deleteMember(id, {
        onSuccess: () => {
          showSnackbar(`Miembro con DNI ${dni} eliminado correctamente.`, 'success');
          refetch();
        },
        onError: (error: Error) => {
          showSnackbar(`Error al eliminar miembro: ${error.message}`, 'error');
        },
      });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>, isEditMode: boolean) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const commonData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dni: formData.get('dni') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      renewalDate: formData.get('renewalDate') as string,
      membershipStatus: formData.get('membershipStatus') as MembershipStatus,
      membershipPlanId: formData.get('membershipPlanId') as string,
    };

    if (isEditMode && editingMember) {
      const memberData: UpdateMemberData = commonData;
      updateMember({ id: editingMember.id, data: memberData }, {
        onSuccess: () => {
          showSnackbar('Miembro actualizado exitosamente.', 'success');
          handleEditClose();
          refetch();
        },
        onError: (error: Error) => {
          showSnackbar(`Error al actualizar miembro: ${error.message}`, 'error');
        },
      });
    } else {
      const memberData: CreateMemberData = {
        ...commonData,
        startDate: new Date().toISOString(), 
      };
      createMember(memberData, {
        onSuccess: () => {
          showSnackbar('Miembro creado exitosamente.', 'success');
          setCreateDialogOpen(false);
          refetch();
        },
        onError: (error: Error) => {
          showSnackbar(`Error al crear miembro: ${error.message}`, 'error');
        },
      });
    }
  };
  
  const handleUpdateAllStatuses = () => {
    if (window.confirm('¿Actualizar todos los estados de membresía basados en fechas de renovación?')) {
      updateStatuses(undefined, {
        onSuccess: () => {
          showSnackbar('Estados de membresía actualizados.', 'success');
          refetch();
        },
        onError: (error: Error) => {
          showSnackbar(`Error al actualizar estados: ${error.message}`, 'error');
        },
      });
    }
  };

  const getStatusColor = (membershipStatus: MembershipStatus): 'success' | 'error' | 'warning' | 'default' => {
    if (membershipStatus === 'active') return 'success';
    if (membershipStatus === 'expired') return 'error';
    if (membershipStatus === 'pending') return 'warning';
    return 'default';
  };

  const getPlanNameById = (planId: string): string => {
    const plan = membershipPlans.find(p => p.id === planId);
    return plan ? `${plan.name} (${plan.duration})` : 'N/A';
  };

  const columns: GridColDef<Member>[] = useMemo(
    () => [
      { field: 'dni', headerName: 'DNI', width: 100, fontWeight: 'bold' },
      { field: 'firstName', headerName: 'Nombre', width: 130 },
      { field: 'lastName', headerName: 'Apellido', width: 130 },
      { field: 'email', headerName: 'Email', width: 180 },
      {
        field: 'membershipStatus',
        headerName: 'Estado',
        width: 110,
        renderCell: (params: GridRenderCellParams<Member, MembershipStatus>) => (
          <Chip
            label={params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : ''}
            color={getStatusColor(params.value as MembershipStatus)}
            size="small"
            variant="filled"
          />
        ),
      },
      { 
        field: 'membershipPlanId',
        headerName: 'Plan', 
        width: 150,
        valueGetter: (_value, row) => getPlanNameById(row.membershipPlanId || '')
      },
      {
        field: 'renewalDate',
        headerName: 'Renovación',
        width: 120,
        valueFormatter: (value: string) => new Date(value).toLocaleDateString('es-ES'),
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Member>) => (
          <Box>
            <Tooltip title="Editar">
              <IconButton onClick={() => handleEditClick(params.row)} size="small" color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => handleDeleteClick(params.row.id, params.row.dni)} size="small" color="error" disabled={isDeleting}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [membershipPlans, refetch, isDeleting] 
  );

  const defaultMemberData = useMemo(() => {
    const firstPlanId = membershipPlans[0]?.id;
    return {
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      phone: '',
      renewalDate: new Date().toISOString().split('T')[0],
      membershipStatus: 'active' as MembershipStatus,
      membershipPlanId: firstPlanId || '',
    };
  }, [membershipPlans]);

  const memberFormFields = (currentData: typeof defaultMemberData & {id?: string} ) => {
    return (
      <Grid container spacing={2} sx={{pt: 1}}>
        <Grid item xs={12} sm={6}>
          <TextField margin="dense" required fullWidth id="firstName" label="Nombre" name="firstName" defaultValue={currentData.firstName} autoFocus />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField margin="dense" required fullWidth id="lastName" label="Apellido" name="lastName" defaultValue={currentData.lastName} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField margin="dense" required fullWidth id="dni" label="DNI" name="dni" defaultValue={currentData.dni} InputProps={{ readOnly: !!currentData.id }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField margin="dense" fullWidth id="email" label="Email" name="email" type="email" defaultValue={currentData.email} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField margin="dense" fullWidth id="phone" label="Teléfono" name="phone" defaultValue={currentData.phone} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField InputLabelProps={{ shrink: true }} margin="dense" required fullWidth id="renewalDate" label="Fecha de Renovación" name="renewalDate" type="date" defaultValue={currentData.renewalDate} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="membershipPlanId-label">Plan de Membresía</InputLabel>
            <Select labelId="membershipPlanId-label" id="membershipPlanId" name="membershipPlanId" defaultValue={currentData.membershipPlanId} label="Plan de Membresía" disabled={isLoadingPlans}>
              {isLoadingPlans && <MenuItem value={currentData.membershipPlanId}><CircularProgress size={20} sx={{mr:1}}/>Cargando planes...</MenuItem>}
              {!isLoadingPlans && membershipPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name} ({plan.duration} - ${plan.price})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="membershipStatus-label">Estado de Membresía</InputLabel>
            <Select labelId="membershipStatus-label" id="membershipStatus" name="membershipStatus" defaultValue={currentData.membershipStatus} label="Estado de Membresía">
              <MenuItem value="active">Activo</MenuItem>
              <MenuItem value="expired">Expirado</MenuItem>
              <MenuItem value="pending">Pendiente</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  };
  
  if (isLoadingMembers || isLoadingPlans && !createDialogOpen && !editingMember) { // Don't show main loading if a dialog is open and plans are still loading for it
    return <LoadingAnimation />;
  }

  if (isErrorMembers) {
    return (<Paper sx={{ p: 3 }}><Typography color="error">Error al cargar miembros.</Typography><Button onClick={() => refetch()} startIcon={<RefreshIcon />} sx={{ mt: 2 }}>Reintentar</Button></Paper>);
  }
   if (isErrorPlans) {
    return (<Paper sx={{ p: 3 }}><Typography color="error">Error al cargar planes de membresía.</Typography><Button onClick={() => refetch()} startIcon={<RefreshIcon />} sx={{ mt: 2 }}>Reintentar Carga de Planes</Button></Paper>);
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom component="div" sx={{ mb: 2 }}>
          Gestión de Miembros
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexGrow: 1, minWidth: '200px'  }}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField label="Buscar DNI, Nombre o Apellido" variant="outlined" size="small" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} sx={{ flexGrow: 1 }}/>
          </Box>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value as MembershipStatus | 'all')}>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Activo</MenuItem>
              <MenuItem value="expired">Expirado</MenuItem>
              <MenuItem value="pending">Pendiente</MenuItem>
            </Select>
          </FormControl>
           <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleUpdateAllStatuses} disabled={isUpdatingStatuses} size="medium">
            {isUpdatingStatuses ? 'Actualizando...' : 'Actualizar Estados'}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)} size="medium">
            Registrar Miembro
          </Button>
        </Box>

        <Box sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={filteredMembers}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 }}}}
            loading={isLoadingMembers || isUpdatingStatuses || isDeleting}
            rowSelection={false}
            onRowClick={(params) => onMemberSelect && onMemberSelect(params.row as Member)}
            getRowId={(row) => row.id}
          />
        </Box>
      </Paper>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Nuevo Miembro</DialogTitle>
        <Box component="form" id="create-member-form" onSubmit={(e) => handleFormSubmit(e, false)}>
          <DialogContent>
            {memberFormFields(defaultMemberData)}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? 'Registrando...' : 'Registrar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {editingMember && (
        <Dialog open={!!editingMember} onClose={handleEditClose} maxWidth="md" fullWidth>
          <DialogTitle>Editar Miembro: {editingMember.firstName} {editingMember.lastName}</DialogTitle>
          <Box component="form" id="edit-member-form" onSubmit={(e) => handleFormSubmit(e, true)}>
            <DialogContent>
              {memberFormFields({
                ...editingMember,
                email: editingMember.email || '', 
                phone: editingMember.phone || '',
                renewalDate: editingMember.renewalDate ? new Date(editingMember.renewalDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              } as typeof defaultMemberData & { id?: string })}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditClose}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={isUpdating}>
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}
    </Container>
  );
}