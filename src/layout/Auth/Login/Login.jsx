import { useEffect } from 'react';
import {Live} from "../Config";

function Login() {

  clientId = 'react-ui-client-7050';
  const redirectUri = `${Live.redirectUri}/login/oauth2/code/react-ui-client-7050-oidc`;
  const authUrl = `${Live.Auth}/oauth2/authorize`;

  const handleLogin = () => {
    window.location.href = `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=thy.read`;
  };



  return (
    <div>
      <button onClick={handleLogin}></button>
    </div>
  );
}

export default Login;
