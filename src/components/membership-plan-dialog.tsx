import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  MembershipPlan,
  useCreateMembershipPlan,
  useUpdateMembershipPlan,
} from '@/modules/membership-plan';
import React, { useState } from 'react';

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
  const [planCost, setPlanCost] = useState(plan?.price?.toString());
  const createMutation = useCreateMembershipPlan();
  const updateMutation = useUpdateMembershipPlan();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const planData = {
      name: formData.get('name') as string,
      duration: Number(formData.get('duration')),
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
        {plan ? 'Edit Membership Plan' : 'Create Membership Plan'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Plan Name"
            type="text"
            fullWidth
            defaultValue={plan?.name || ''}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration (months)"
            type="number"
            fullWidth
            defaultValue={plan?.duration || ''}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="text"
            fullWidth
            onChange={(event) => {
              const newValue = event.target.value;

              // This regex allows only numbers and one decimal point
              if (/^\d*\.?\d*$/.test(newValue)) {
                setPlanCost(newValue);
              }
            }}
            value={planCost}
            defaultValue={plan?.price || ''}
            inputProps={{
              inputMode: 'decimal',
              pattern: '[0-9]*[.,]?[0-9]*',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">{plan ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
