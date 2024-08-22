import { Box, Button, TextField } from '@mui/material';
import { CreateMemberData, useRegisterMember } from '@/member';
import React from 'react';

export function RegisterMemberForm() {
  const { mutateAsync: registerMember, isPending } = useRegisterMember();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const memberData: CreateMemberData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };
    await registerMember(memberData);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        margin="normal"
        required
      />
      <TextField fullWidth label="Phone" name="phone" margin="normal" />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          type="submit"
          disabled={isPending}
          variant="contained"
          color="primary"
          size="large"
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </form>
  );
}
