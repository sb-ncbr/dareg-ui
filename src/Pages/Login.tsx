import { Button, Card, CardContent, CardMedia, Divider, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAuth, hasAuthParams } from 'react-oidc-context';
import ceitec_logo from '../ceitec_logo.png'
import { useLocation } from 'react-router-dom';
import useLocalStorage from '../Utils/useLocalStorage';

const Login = () => {

  const auth = useAuth();
  const location = useLocation();
  const r = "dareg-"+(Math.random() + 1).toString(36).substring(7);
  const [authNonce, setAuthNonce] = useLocalStorage(r, "none");

  const [tab, setTab] = useState("login");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newTab: string,
  ) => {
    if (newTab !== null)
      setTab(newTab);
  };

  const initLogin = () => {
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
      <Card variant="outlined" sx={{ width: 400 }}>
        <CardContent>
          <CardMedia
            component="img"
            image={ceitec_logo}
            />
            <Typography align='center'>DAREG - Dataset Registry</Typography>
            <Divider variant='middle' sx={{mt: 2, mb:2 }}></Divider>
          {/* <ToggleButtonGroup
            color="primary"
            value={tab}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            fullWidth
            size="small"
            sx={{ mt: 1 }}
            >
            <ToggleButton value="login">Log-in</ToggleButton>
            <ToggleButton value="signup">Sign-up</ToggleButton>
          </ToggleButtonGroup>
          {tab==="login" ?
            <Box>
              <TextField sx={{ mt: 2 }} label="Username" variant="outlined" fullWidth />
              <TextField sx={{ mt: 2 }} label="Password" variant="outlined" fullWidth />
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                <Link variant="body2">Reset password</Link>
              </Stack>
              <Button sx={{ mt: 1 }} size="large" variant="outlined" fullWidth>Log-in</Button>
            </Box>
          :
            <Box>
              <TextField sx={{ mt: 2 }} label="Username" variant="outlined" fullWidth />
              <TextField sx={{ mt: 2 }} label="E-mail" variant="outlined" fullWidth />
              <TextField sx={{ mt: 2 }} label="Password" variant="outlined" fullWidth />
              <TextField sx={{ mt: 2 }} label="Repeat password" variant="outlined" fullWidth />
              <Button sx={{ mt: 2 }} size="large" variant="outlined" fullWidth>Sign-up</Button>
            </Box>
          } */}
          <Button sx={{ mt: 1 }} size="large" variant="outlined" fullWidth onClick={() => initLogin()}>Log-in using CEITEC ID</Button>
        </CardContent>
      </Card>
  );
}

export default Login;
