import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Alert,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import {
  Member,
  MembershipStatus,
  RenewMembershipData,
  useSearchMemberByDni,
  useRenewMembership,
  useGetMembers,
} from '@/modules/member';
import { useNotificationStore } from '@/stores/notification.store';
import { MembershipPlan as MembershipPlanType, useMembershipPlans } from '@/modules/membership-plan';

export function DniSearchAndRenewal() {
  const [searchDni, setSearchDni] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [renewalDate, setRenewalDate] = useState('');
  const [renewalPlanId, setRenewalPlanId] = useState<string>('');

  // Hooks
  const { data: allMembers = [] } = useGetMembers();
  const { data: foundMember, isLoading: isSearching, error } = useSearchMemberByDni(
    searchDni, 
    searchDni.length >= 3
  );
  const { mutate: renewMembership, isPending: isRenewing } = useRenewMembership();
  const showSnackbar = useNotificationStore((state) => state.showSnackbar);
  const { data: membershipPlans = [] } = useMembershipPlans();

  // Update selected member when search results change
  useEffect(() => {
    setSelectedMember(foundMember || null);
  }, [foundMember]);

  // Get DNI options for autocomplete
  const dniOptions = allMembers.map(member => ({
    label: `${member.dni} - ${member.firstName} ${member.lastName}`,
    dni: member.dni,
    member: member,
  }));

  const handleDniSelect = (newValue: any) => {
    if (newValue) {
      setSearchDni(newValue.dni);
      setSelectedMember(newValue.member);
    } else {
      setSearchDni('');
      setSelectedMember(null);
    }
  };

  const handleOpenRenewalDialog = () => {
    if (!selectedMember) return;
    
    // Set default renewal date to +1 month from current renewal date
    const currentRenewal = new Date(selectedMember.renewalDate);
    currentRenewal.setMonth(currentRenewal.getMonth() + 1);
    setRenewalDate(currentRenewal.toISOString().split('.')[0]);
    setRenewalPlanId(selectedMember.membershipPlanId || '');
    setRenewalDialogOpen(true);
  };

  const handleQuickRenewal = () => {
    if (!selectedMember) return;

    const currentRenewal = new Date(selectedMember.renewalDate);
    currentRenewal.setMonth(currentRenewal.getMonth() + 1);
    
    const renewData: RenewMembershipData = {
      dni: selectedMember.dni,
      renewalDate: currentRenewal.toISOString(),
      membershipPlanId: selectedMember.membershipPlanId,
    };

    renewMembership(renewData, {
      onSuccess: (updatedMember) => {
        setSelectedMember(updatedMember);
        showSnackbar(`Renovación rápida exitosa para ${selectedMember.firstName}`, 'success');
      },
    });
  };

  const handleCustomRenewal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedMember) return;

    const renewData: RenewMembershipData = {
      dni: selectedMember.dni,
      renewalDate: renewalDate,
      membershipPlanId: renewalPlanId,
    };

    renewMembership(renewData, {
      onSuccess: (updatedMember) => {
        setSelectedMember(updatedMember);
        setRenewalDialogOpen(false);
        showSnackbar(`Renovación personalizada exitosa para ${selectedMember.firstName}`, 'success');
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiration = (renewalDate: string) => {
    const renewal = new Date(renewalDate);
    const today = new Date();
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPlanNameById = (planId: string | null | undefined): string => {
    if (!planId) return 'N/A';
    const plan = membershipPlans.find(p => p.id === planId);
    return plan ? plan.name : 'N/A';
  };

  const getExpirationStatus = (renewalDate: string) => {
    const days = getDaysUntilExpiration(renewalDate);
    if (days < 0) return { color: 'error', label: `Vencido hace ${Math.abs(days)} días` };
    if (days <= 7) return { color: 'warning', label: `Vence en ${days} días` };
    return { color: 'success', label: `Válido por ${days} días` };
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Búsqueda por DNI y Renovaciones
      </Typography>

      {/* DNI Search Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Autocomplete
              options={dniOptions}
              getOptionLabel={(option) => option.label}
              value={dniOptions.find(opt => opt.dni === searchDni) || null}
              onChange={(event, newValue) => handleDniSelect(newValue)}
              loading={isSearching}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar por DNI"
                  placeholder="Ingrese DNI o seleccione de la lista"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1">
                      <strong>{option.dni}</strong> - {option.member.firstName} {option.member.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getPlanNameById(option.member.membershipPlanId)} | {option.member.membershipStatus}
                    </Typography>
                  </Box>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Búsqueda directa por DNI"
              value={searchDni}
              onChange={(e) => setSearchDni(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al buscar miembro. Por favor verifique el DNI ingresado.
          </Alert>
        )}
      </Box>

      {/* Member Information and Actions */}
      {selectedMember ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Member Info */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>DNI:</strong> {selectedMember.dni}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Email:</strong> {selectedMember.email || 'No especificado'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Teléfono:</strong> {selectedMember.phone || 'No especificado'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Plan:</strong> {getPlanNameById(selectedMember.membershipPlanId)}
                </Typography>
              </Grid>

              {/* Membership Status */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Estado de Membresía</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={selectedMember.membershipStatus}
                    color={selectedMember.membershipStatus === 'active' ? 'success' : 'error'}
                    variant="filled"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={getExpirationStatus(selectedMember.renewalDate).label}
                    color={getExpirationStatus(selectedMember.renewalDate).color as any}
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Fecha de Inicio:</strong> {formatDate(selectedMember.startDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Próxima Renovación:</strong> {formatDate(selectedMember.renewalDate)}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<SpeedIcon />}
                onClick={handleQuickRenewal}
                disabled={isRenewing}
                color="primary"
              >
                {isRenewing ? 'Renovando...' : 'Renovar +1 Mes'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={handleOpenRenewalDialog}
                disabled={isRenewing}
              >
                Renovación Personalizada
              </Button>

              <Button
                variant="outlined"
                startIcon={<PaymentIcon />}
                disabled
                color="info"
              >
                Registrar Pago (Próximamente)
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : searchDni.length >= 3 && !isSearching ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No se encontró ningún miembro con DNI: <strong>{searchDni}</strong>
        </Alert>
      ) : null}

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="caption" color="text.secondary">
            Búsquedas hoy
          </Typography>
          <Typography variant="h6">
            {/* This would come from analytics later */}
            --
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="caption" color="text.secondary">
            Renovaciones hoy
          </Typography>
          <Typography variant="h6">
            {/* This would come from analytics later */}
            --
          </Typography>
        </Paper>
      </Box>

      {/* Custom Renewal Dialog */}
      <Dialog 
        open={renewalDialogOpen} 
        onClose={() => setRenewalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Renovación Personalizada - {selectedMember?.firstName} {selectedMember?.lastName}
        </DialogTitle>
        <form onSubmit={handleCustomRenewal}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <strong>DNI:</strong> {selectedMember?.dni} | 
                  <strong> Estado Actual:</strong> {selectedMember?.membershipStatus} | 
                  <strong> Vencimiento Actual:</strong> {selectedMember ? formatDate(selectedMember.renewalDate) : ''}
                </Alert>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Nueva Fecha de Renovación"
                  type="datetime-local"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  helperText="Seleccione la nueva fecha de vencimiento"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Plan de Membresía</InputLabel>
                  <Select
                    value={renewalPlanId}
                    label="Plan de Membresía"
                    onChange={(e) => setRenewalPlanId(e.target.value as string)}
                  >
                    {membershipPlans.map((plan: MembershipPlanType) => (
                       <MenuItem key={plan.id} value={plan.id}>
                         {plan.name} ({plan.duration} - ${plan.price})
                       </MenuItem>
                     ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRenewalDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isRenewing}
              startIcon={<CalendarIcon />}
            >
              {isRenewing ? 'Renovando...' : 'Confirmar Renovación'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
} 