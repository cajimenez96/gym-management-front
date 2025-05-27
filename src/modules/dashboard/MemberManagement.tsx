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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Member,
  MembershipStatus,
  MembershipPlan,
  CreateMemberData,
  UpdateMemberData,
  useGetMembers,
  useRegisterMember,
  useUpdateMember,
  useDeleteMember,
  useUpdateMemberStatuses,
} from '@/modules/member';
import { LoadingAnimation } from '@/components';
import { useSnackbar } from '@/context';

interface MemberManagementProps {
  onMemberSelect?: (member: Member) => void;
}

export function MemberManagement({ onMemberSelect }: MemberManagementProps) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<MembershipStatus | 'all'>('all');

  const { data: members = [], isLoading, isError, refetch } = useGetMembers();
  const { mutate: createMember, isPending: isCreating } = useRegisterMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember } = useDeleteMember();
  const { mutate: updateStatuses, isPending: isUpdatingStatuses } = useUpdateMemberStatuses();
  const { showSnackbar } = useSnackbar();

  // Filter members based on search and status
  const filteredMembers = useMemo(() => {
    let filtered = members;

    if (searchFilter) {
      filtered = filtered.filter(
        (member) =>
          member.dni.toLowerCase().includes(searchFilter.toLowerCase()) ||
          member.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((member) => member.membershipStatus === statusFilter);
    }

    return filtered;
  }, [members, searchFilter, statusFilter]);

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
  };

  const handleEditClose = () => {
    setEditingMember(null);
  };

  const handleDeleteClick = async (id: string, dni: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el miembro con DNI ${dni}?`)) {
      deleteMember(id);
    }
  };

  const handleCreateMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const memberData: CreateMemberData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dni: formData.get('dni') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      startDate: new Date().toISOString(),
      renewalDate: formData.get('renewalDate') as string,
      membershipStatus: formData.get('membershipStatus') as MembershipStatus,
      membershipPlan: formData.get('membershipPlan') as MembershipPlan,
    };

    createMember(memberData);
    setCreateDialogOpen(false);
  };

  const handleUpdateMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember) return;

    const formData = new FormData(event.currentTarget);
    const memberData: UpdateMemberData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dni: formData.get('dni') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      renewalDate: formData.get('renewalDate') as string,
      membershipStatus: formData.get('membershipStatus') as MembershipStatus,
      membershipPlan: formData.get('membershipPlan') as MembershipPlan,
    };

    updateMember({ id: editingMember.id, data: memberData });
    handleEditClose();
  };

  const handleUpdateAllStatuses = () => {
    if (window.confirm('¿Actualizar todos los estados de membresía basados en fechas de renovación?')) {
      updateStatuses();
    }
  };

  const getStatusColor = (membershipStatus: MembershipStatus): 'success' | 'error' => {
    return membershipStatus === 'active' ? 'success' : 'error';
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'dni', headerName: 'DNI', width: 120, fontWeight: 'bold' },
      { field: 'firstName', headerName: 'Nombre', width: 150 },
      { field: 'lastName', headerName: 'Apellido', width: 150 },
      { field: 'email', headerName: 'Email', width: 200 },
      { field: 'phone', headerName: 'Teléfono', width: 140 },
      {
        field: 'membershipStatus',
        headerName: 'Estado',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={getStatusColor(params.value)}
            size="small"
            variant="filled"
          />
        ),
      },
      { field: 'membershipPlan', headerName: 'Plan', width: 120 },
      {
        field: 'renewalDate',
        headerName: 'Fecha de Renovación',
        width: 130,
        valueFormatter: (value) => new Date(value).toLocaleDateString('es-ES'),
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <Box>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => handleEditClick(params.row)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => handleDeleteClick(params.row.id, params.row.dni)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">Error al cargar los miembros</Typography>
        <Button onClick={() => refetch()} startIcon={<RefreshIcon />} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gestión de Miembros
        </Typography>
        
        {/* Filter and Actions Bar */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar por DNI, nombre o apellido"
              variant="outlined"
              size="small"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value as MembershipStatus | 'all')}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="expired">Vencido</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Nuevo Miembro
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleUpdateAllStatuses}
                disabled={isUpdatingStatuses}
              >
                Actualizar Estados
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => refetch()}
              >
                Recargar
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Members Stats */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total: {filteredMembers.length} | 
            Activos: {filteredMembers.filter(m => m.membershipStatus === 'active').length} | 
            Vencidos: {filteredMembers.filter(m => m.membershipStatus === 'expired').length}
          </Typography>
        </Box>
      </Box>

      {/* Members DataGrid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredMembers}
          columns={columns}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          onRowClick={(params) => onMemberSelect && onMemberSelect(params.row)}
          sx={{
            '& .MuiDataGrid-row:hover': {
              cursor: onMemberSelect ? 'pointer' : 'default',
            },
          }}
        />
      </Box>

      {/* Create Member Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Crear Nuevo Miembro</DialogTitle>
        <form onSubmit={handleCreateMember}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="Nombre"
                  fullWidth
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Apellido"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dni"
                  label="DNI"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Teléfono"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="renewalDate"
                  label="Fecha de Renovación"
                  type="datetime-local"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select name="membershipStatus" required defaultValue="active">
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="expired">Vencido</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Plan</InputLabel>
                  <Select name="membershipPlan" required defaultValue="monthly">
                    <MenuItem value="monthly">Mensual</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog 
        open={!!editingMember} 
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Miembro</DialogTitle>
        <form onSubmit={handleUpdateMember}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="Nombre"
                  fullWidth
                  required
                  defaultValue={editingMember?.firstName || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Apellido"
                  fullWidth
                  required
                  defaultValue={editingMember?.lastName || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dni"
                  label="DNI"
                  fullWidth
                  required
                  defaultValue={editingMember?.dni || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  defaultValue={editingMember?.email || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Teléfono"
                  fullWidth
                  defaultValue={editingMember?.phone || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="renewalDate"
                  label="Fecha de Renovación"
                  type="datetime-local"
                  fullWidth
                  required
                  defaultValue={editingMember?.renewalDate?.split('.')[0] || ''}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select 
                    name="membershipStatus" 
                    required 
                    defaultValue={editingMember?.membershipStatus || 'active'}
                  >
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="expired">Vencido</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Plan</InputLabel>
                  <Select 
                    name="membershipPlan" 
                    required 
                    defaultValue={editingMember?.membershipPlan || 'monthly'}
                  >
                    <MenuItem value="monthly">Mensual</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isUpdating}>
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}