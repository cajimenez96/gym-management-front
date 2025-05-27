import React from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography
} from '@mui/material';
import { 
  CreateMemberData, 
  MembershipStatus, 
  useRegisterMember 
} from '@/modules/member';
import { useMembershipPlans, MembershipPlan as MembershipPlanEntity } from '@/modules/membership-plan';

export function RegisterMemberForm() {
  const { mutateAsync: registerMember, isPending } = useRegisterMember();
  const { data: membershipPlans = [], isLoading: isLoadingPlans } = useMembershipPlans();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      membershipPlanId: formData.get('membershipPlanId') as string || null,
    };
    
    await registerMember(memberData);
    event.currentTarget.reset();
  };

  // Calculate default renewal date (1 month from now)
  const getDefaultRenewalDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('.')[0];
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Registrar Nuevo Miembro
      </Typography>
      
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              Información Personal
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="firstName"
              required
              autoFocus
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="lastName"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DNI"
              name="dni"
              required
              helperText="Número de identificación único"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              helperText="Opcional"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              helperText="Opcional"
            />
          </Grid>

          {/* Membership Information */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              Información de Membresía
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Renovación"
              name="renewalDate"
              type="datetime-local"
              required
              defaultValue={getDefaultRenewalDate()}
              InputLabelProps={{ shrink: true }}
              helperText="Cuándo vence la membresía"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="membership-plan-id-label">Plan de Membresía</InputLabel>
              <Select
                name="membershipPlanId"
                labelId="membership-plan-id-label"
                label="Plan de Membresía"
                defaultValue=""
                disabled={isLoadingPlans}
              >
                <MenuItem value=""><em>Sin plan</em></MenuItem>
                {membershipPlans.map((plan: MembershipPlanEntity) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="membership-status-label">Estado de Membresía</InputLabel>
              <Select
                name="membershipStatus"
                labelId="membership-status-label"
                label="Estado de Membresía"
                defaultValue="active"
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="expired">Vencido</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                type="submit"
                disabled={isPending || isLoadingPlans}
                variant="contained"
                color="primary"
                size="large"
              >
                {isPending ? 'Registrando Miembro...' : 'Registrar Miembro'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
