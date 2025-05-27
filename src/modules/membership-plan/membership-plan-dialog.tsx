import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {
  MembershipPlan,
  useCreateMembershipPlan,
  useUpdateMembershipPlan,
} from '@/modules/membership-plan';
import React from 'react';

interface MembershipPlanDialogProps {
  open: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
}

export const MembershipPlanDialog: React.FC<MembershipPlanDialogProps> = ({
  open,
  onClose,
  plan,
}) => {
  const createMutation = useCreateMembershipPlan();
  const updateMutation = useUpdateMembershipPlan();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const planData = {
      name: formData.get('name') as string,
      duration: formData.get('duration') as string,
      price: Number(formData.get('price')),
    };

    if (plan) {
      updateMutation.mutate(
        { plan: planData, id: plan.id },
        {
          onSuccess: onClose,
        },
      );
    } else {
      createMutation.mutate(planData, {
        onSuccess: onClose,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {plan ? 'Editar Plan de Membresía' : 'Crear Plan de Membresía'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre del Plan"
            type="text"
            fullWidth
            defaultValue={plan?.name || ''}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="duration-label">Duración</InputLabel>
            <Select
              labelId="duration-label"
              name="duration"
              label="Duración"
              defaultValue={plan?.duration || ''}
            >
              <MenuItem value="daily">Diario</MenuItem>
              <MenuItem value="weekly">Semanal</MenuItem>
              <MenuItem value="monthly">Mensual</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="price"
            label="Precio"
            type="text"
            fullWidth
            defaultValue={plan?.price || ''}
            inputProps={{
              inputMode: 'decimal',
              pattern: '[0-9]*[.,]?[0-9]*',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit">{plan ? 'Actualizar' : 'Crear'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
