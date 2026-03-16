import { TextField, Button, Box, Alert, Typography, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { setUserToken } from '../../features/authSlice';
import { getToken, storeToken, registerAccount } from '../../services/LocalStorageService';
import { useLoginUserMutation } from '../../services/userAuthApi';

const UserLogin = () => {
  const [server_error, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if (res.error) {
      setServerError(res.error.data?.error || res.error.data?.message || "Login Failed")
    }
    if (res.data) {
      storeToken(res.data)
      registerAccount(res.data, res.data.user)
      let { access_token } = getToken()
      dispatch(setUserToken({ access_token: access_token }))
      navigate('/admin/dashboard')
    }
  }

  let { access_token } = getToken()
  useEffect(() => {
    if (access_token) {
      dispatch(setUserToken({ access_token: access_token }))
    }
  }, [access_token, dispatch])


  return (
    <Box component='form' noValidate sx={{ mt: 1, p: 4 }} id='login-form' onSubmit={handleSubmit}>
      {server_error && <Alert severity='error' sx={{ mb: 2 }}>{server_error}</Alert>}

      <TextField
        margin='normal'
        required
        fullWidth
        id='email'
        name='email'
        label='Email Address'
        autoFocus
      />

      <TextField
        margin='normal'
        required
        fullWidth
        id='password'
        name='password'
        label='Password'
        type={showPassword ? 'text' : 'password'}
        autoComplete='current-password'
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box textAlign='center'>
        {isLoading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5, py: 1.2, fontWeight: 'bold' }}>
            Login
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <NavLink to='/sendpasswordresetemail' style={{ textDecoration: 'none', color: '#1976d2', fontSize: '0.9rem' }}>
          Forgot Password?
        </NavLink>
      </Box>
    </Box>
  );
};

export default UserLogin;