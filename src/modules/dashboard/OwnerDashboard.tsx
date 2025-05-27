import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { useRoleAccess } from '@/modules/auth';
import { MemberManagement } from './MemberManagement';
import { DniSearchAndRenewal } from './DniSearchAndRenewal';

export function OwnerDashboard() {
  const { user } = useRoleAccess();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Owner Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {user?.username}! Here's your gym management overview.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Stats Overview Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistics Overview
            </Typography>
            <Typography color="text.secondary">
              Member statistics and business metrics will be displayed here.
            </Typography>
          </Paper>
        </Grid>

        {/* DNI Search & Renewal Section - Now Functional */}
        <Grid item xs={12} md={6}>
          <DniSearchAndRenewal />
        </Grid>

        {/* Revenue Tracking Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Tracking
            </Typography>
            <Typography color="text.secondary">
              Monthly revenue and business performance metrics.
            </Typography>
          </Paper>
        </Grid>

        {/* Member Management Section - Full Width */}
        <Grid item xs={12}>
          <MemberManagement />
        </Grid>
      </Grid>
    </Container>
  );
} 