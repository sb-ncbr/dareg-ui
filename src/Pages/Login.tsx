import { Box, Button, Card, CardContent, CardMedia, Link, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useState } from 'react';
import ListCardBase from '../Components/ListCardBase';
import ceitec_logo from '../ceitec_logo.png'

const Login = () => {
  const [tab, setTab] = useState("login");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newTab: string,
  ) => {
    if (newTab !== null)
      setTab(newTab);
  };

  return (
    <Box alignItems="center" justifyContent="center" display="flex" height="100vh">
      <Card variant="outlined" sx={{ width: 400 }}>
        <CardContent>
          <CardMedia
            component="img"
            image={ceitec_logo}
            />
          <ToggleButtonGroup
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
          }
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
