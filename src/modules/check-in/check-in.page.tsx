import React from 'react';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useCheckInPage } from './use-check-in-page.ts';
import { LoadingAnimation } from '@/components';
import { CheckIn } from '@/modules/check-in';
import { Member, useGetMemberCheckInInfoByDni, MemberCheckInInfoDto } from '@/modules/member';
import { format, parseISO } from 'date-fns';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSnackbar } from '@/context';

function CheckInTable({
  checkIns,
  isMobile,
}: {
  checkIns: CheckIn[];
  isMobile: boolean;
}) {
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Fecha',
      width: 110,
      valueGetter: (_, row) => format(parseISO(row.dateTime), 'yyyy-MM-dd'),
    },
    {
      field: 'time',
      headerName: 'Hora',
      width: 110,
      valueGetter: (_, row) => format(parseISO(row.dateTime ?? ''), 'HH:mm'),
    },
    {
      field: 'firstName',
      headerName: 'Nombre',
      width: 130,
      valueGetter: (_, row) => row.member.firstName,
    },
    {
      field: 'lastName',
      headerName: 'Apellido',
      width: 130,
      valueGetter: (_, row) => row.member.lastName,
    },
  ];

  if (!isMobile) {
    columns.push({
      field: 'email',
      headerName: 'Email',
      width: 200,
      valueGetter: (_, row) => row.member.email,
    });
  }

  return (
    <Paper sx={{ width: '100%', height: 'calc(100vh - 270px)' }}>
      <DataGrid
        rows={checkIns}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection={false}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}

export function CheckInPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar } = useSnackbar();

  const {
    checkInMember,
    filteredCheckIns,
    isCheckInPending,
    isDataLoading,
    isError,
  } = useCheckInPage();

  const [dniInput, setDniInput] = React.useState('');
  const [dniToSearch, setDniToSearch] = React.useState<string | null>(null);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = React.useState(false);
  const [memberToCheckIn, setMemberToCheckIn] = React.useState<MemberCheckInInfoDto | null>(null);

  const {
    data: memberInfo,
    isLoading: isLoadingInfo,
    error: errorInfo,
    refetch: refetchMemberInfo,
  } = useGetMemberCheckInInfoByDni(dniToSearch, {
    enabled: !!dniToSearch && isInfoPopupOpen,
  });

  const handleDniInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 8) {
      setDniInput(numericValue);
    }
  };

  const handleSearchDni = () => {
    if (dniInput.trim().length === 8) {
      setDniToSearch(dniInput.trim());
      setIsInfoPopupOpen(true);
      setMemberToCheckIn(null);
    } else {
      showSnackbar('El DNI debe tener 8 dígitos numéricos.', 'warning');
    }
  };

  const handleCloseInfoPopup = () => {
    setIsInfoPopupOpen(false);
    setTimeout(() => {
      setDniToSearch(null);
      setMemberToCheckIn(null);
    }, theme.transitions.duration.leavingScreen);
  };

  const handleActualCheckIn = async () => {
    if (memberToCheckIn && memberToCheckIn.id) {
      try {
        await checkInMember(memberToCheckIn.id);
        showSnackbar(`Check-in registrado para ${memberToCheckIn.firstName} ${memberToCheckIn.lastName}`, 'success');
        handleCloseInfoPopup();
      } catch (error: any) {
        const message = error?.message || 'Error al registrar el check-in.';
        showSnackbar(message, 'error');
      }
    } else if (memberInfo && memberInfo.id) {
      try {
        await checkInMember(memberInfo.id);
        showSnackbar(`Check-in registrado para ${memberInfo.firstName} ${memberInfo.lastName}`, 'success');
        handleCloseInfoPopup();
      } catch (error: any) {
        const message = error?.message || 'Error al registrar el check-in.';
        showSnackbar(message, 'error');
      }
    }
  };

  React.useEffect(() => {
    if (memberInfo && !isLoadingInfo && !errorInfo) {
      setMemberToCheckIn(memberInfo);
    } else {
      setMemberToCheckIn(null);
    }
  }, [memberInfo, isLoadingInfo, errorInfo]);

  if (isDataLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return <Typography>Ocurrió un error cargando la página de check-in.</Typography>;
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Gimnasio - Control de Acceso
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Ingresar DNI para Información y Asistencia
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="Ingresar DNI del Miembro (8 dígitos)"
            variant="outlined"
            value={dniInput}
            onChange={handleDniInputChange}
            inputProps={{ maxLength: 8, inputMode: 'numeric', pattern: '[0-9]*' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && dniInput.trim().length === 8) {
                handleSearchDni();
              }
            }}
            sx={{ flexGrow: 1 }}
            disabled={isLoadingInfo || isCheckInPending}
          />
          <Button
            variant="contained"
            onClick={handleSearchDni}
            disabled={dniInput.trim().length !== 8 || isLoadingInfo || isCheckInPending}
            color="primary"
            sx={{ minWidth: 120, height: '56px' }}
          >
            {isLoadingInfo ? <CircularProgress size={24} color="inherit" /> : 'Buscar / Verificar'}
          </Button>
        </Box>
      </Paper>

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <CheckInTable checkIns={filteredCheckIns} isMobile={isMobile} />
      </Box>

      <Dialog open={isInfoPopupOpen} onClose={handleCloseInfoPopup} fullWidth maxWidth="xs">
        <DialogTitle>Información del Miembro</DialogTitle>
        <DialogContent dividers>
          {isLoadingInfo && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
              <CircularProgress />
            </Box>
          )}
          {errorInfo && !isLoadingInfo && (
            <DialogContentText color="error" sx={{ my: 2, textAlign: 'center' }}>
              <strong>Error al obtener información:</strong><br />
              {(errorInfo as any)?.response?.data?.message || (errorInfo as Error)?.message || 'Ocurrió un error al buscar el miembro.'}
            </DialogContentText>
          )}
          {!isLoadingInfo && !errorInfo && memberInfo && (
            <Grid container spacing={1.5} sx={{ mt: 0.5 }} component="dl">
              <Grid item xs={5}><Typography variant="subtitle1" component="dt">ID:</Typography></Grid>
              <Grid item xs={7}><Typography component="dd">{memberInfo.id}</Typography></Grid>

              <Grid item xs={5}><Typography variant="subtitle1" component="dt">Nombre:</Typography></Grid>
              <Grid item xs={7}><Typography component="dd">{memberInfo.firstName} {memberInfo.lastName}</Typography></Grid>
              
              <Grid item xs={5}><Typography variant="subtitle1" component="dt">Ingreso:</Typography></Grid>
              <Grid item xs={7}><Typography component="dd">{memberInfo.startDate}</Typography></Grid>
              
              <Grid item xs={5}><Typography variant="subtitle1" component="dt">Vencimiento:</Typography></Grid>
              <Grid item xs={7}><Typography component="dd">{memberInfo.renewalDate}</Typography></Grid>
              
              <Grid item xs={5}><Typography variant="subtitle1" component="dt">Plan:</Typography></Grid>
              <Grid item xs={7}><Typography component="dd">{memberInfo.planName || 'No asignado'}</Typography></Grid>
              
              <Grid item xs={5}><Typography variant="subtitle1" component="dt">Estado:</Typography></Grid>
              <Grid item xs={7}>
                <Typography component="dd" color={memberInfo.membershipStatusText === 'Habilitado' ? 'success.main' : 'error.main'} fontWeight="bold">
                  {memberInfo.membershipStatusText}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: '16px 24px' }}>
          <Button onClick={handleCloseInfoPopup} color="secondary">Cerrar</Button>
          {!isLoadingInfo && !errorInfo && memberToCheckIn && memberToCheckIn.membershipStatusText === 'Habilitado' && (
            <Button 
              onClick={handleActualCheckIn} 
              variant="contained" 
              color="success"
              disabled={isCheckInPending}
            >
              {isCheckInPending ? <CircularProgress size={24} color="inherit"/> : 'Registrar Asistencia'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
