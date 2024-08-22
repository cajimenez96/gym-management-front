import { Container, Paper, Typography } from '@mui/material';
import { RegisterMemberForm } from '@/modules/member/register-form.tsx';

export function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 4, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register New Member
        </Typography>
        <RegisterMemberForm />
      </Paper>
    </Container>
  );
}
