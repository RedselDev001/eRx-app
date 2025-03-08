import { Link } from 'react-router-dom';
import { useEffect } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import {Live} from "./Config";

// ================================|| LOGIN ||================================ //

export default function Login() {
  const { isLoggedIn } = useAuth();
  const clientId = 'react-ui-client-7050';
  const redirectUri = `${Live.redirectUri}/login/oauth2/code/react-ui-client-7050-oidc`;
  const authUrl = `${Live.Auth}/oauth2/authorize`;

  const handleLogin = () => {
    window.location.href = `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=thy.read`;
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      handleLogin();
    }
  }, [isLoggedIn]);



  return (
    // <AuthWrapper>
      <Grid container spacing={3}>
      
       
          <AuthLogin isDemo={isLoggedIn} />
       
      </Grid>
    // </AuthWrapper>
  );
}
