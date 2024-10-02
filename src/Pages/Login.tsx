import { Button, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAuth, hasAuthParams } from 'react-oidc-context';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from '../Utils/useLocalStorage';
import einfraLogo from '../Static/e-INFRA_logo_RGB_lilek.png';

const Login = () => {

  const auth = useAuth();
  const location = useLocation();
  const r = "dareg-"+(Math.random() + 1).toString(36).substring(7);
  const [_, setAuthNonce] = useLocalStorage(r, "none");

  const navigate = useNavigate();

  const initLogin = () => {
    if (auth.isAuthenticated && !auth.activeNavigator) {
        navigate(location?.state?.from || "/");
    }
    if (!hasAuthParams() &&
        !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
            const auth_state = {
                id: r,
                redirect: (location?.state?.from || "/").toString(),
                expires: new Date().toLocaleTimeString(),
            }
            setAuthNonce(auth_state);
        auth.signinRedirect({state: {"auth_request_id": r}});
    }
  };

  return (
    <>
      <Typography variant='body1' align='center'>Sign in using</Typography>
      <Button sx={{ mt: 1 }} size="large" variant="outlined" fullWidth onClick={() => initLogin()}>
        <img src={einfraLogo} style={{ width: "100px" }} alt='e-INFRA CZ logo'/>
      </Button>
      <Divider variant='middle' sx={{ mt: 2, mb: 2 }}></Divider>
      <Typography variant='body2' align='center'>CF BioDATA CEITEC - booking.support@ceitec.cz</Typography>
    </>
  );
}

export default Login;
