import { Box, TextField, Button, Alert, Typography, CircularProgress, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useChangeUserPasswordMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorageService'

const ChangePassword = () => {
  const [server_error, setServerError] = useState("")
  const [server_msg, setServerMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [changeUserPassword, { isLoading }] = useChangeUserPasswordMutation()
  const { access_token } = getToken()

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      old_password: data.get('old_password'),
      password: data.get('password'),
      password_confirmation: data.get('password2'),
    }
    const res = await changeUserPassword({ actualData, access_token })
    if (res.error) {
      setServerMsg("")
      setServerError(res.error.data?.error || res.error.data?.message || "Failed to update password")
    }
    if (res.data) {
      setServerError("")
      setServerMsg(res.data.message || "Password updated successfully")
      document.getElementById("password-change-form").reset();
    }
  };

  return (
    <Grid container justifyContent='center' className="pt-8">
      <Grid item sm={8} xs={12}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          Change Password
        </Typography>

        {server_error && <Alert severity='error' sx={{ mb: 2 }}>{server_error}</Alert>}
        {server_msg && <Alert severity='success' sx={{ mb: 2 }}>{server_msg}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} id="password-change-form">
          <TextField
            margin="normal"
            required
            fullWidth
            name="old_password"
            label="Current Password"
            type={showPassword ? 'text' : 'password'}
            id="old_password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            id="password2"
          />

          <Box textAlign='center' sx={{ mt: 3 }}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' sx={{ px: 8, py: 1.2, fontWeight: 'bold' }}>
                Update Password
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
