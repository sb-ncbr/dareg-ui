import { Backdrop, Box, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Outlet, useNavigate } from 'react-router-dom';
import ceitec_logo from '../Static/ceitec_logo.png'
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';


const LoginLayout = () => {

  const navigate = useNavigate()

  return (
    <Box bgcolor={"background.default"} color={"text.primary"}>
      <Stack direction="row" height="100vh">
        <Box sx={{width: "100%"}}>
        <Paper component={Stack} direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{ height: '100vh', backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundImage: `url(https://www.ceitec.eu/data/documents/images/thumb/41532-13-ulozeno-dkf-1600x0-c0.jpeg)` }}>
      <Backdrop open={true}>
        <Grid container direction='row'>
          <Grid offset={{xs: 0, sm: 1, md: 2, lg: 3, xl: 4}} size={{xs: 12, sm: 10, md: 8, lg: 6, xl: 4}}>
            <Paper elevation={4} sx={{ m:1, mt: 10, p: 5}} component={Stack} direction='column' justifyContent='center'>
            <img src={ceitec_logo} style={{ width: "50%", margin: "auto" }} alt='CEITEC logo'/>
            <Typography variant='h4' align='center' sx={{fontWeight: "bold"}}>DAREG</Typography>
            <Typography variant='h6' align='center'>Dataset Registry</Typography>
            <Divider variant='middle' sx={{ mt: 2, mb: 2 }}></Divider>
              <Outlet />
            </Paper>
          </Grid>
        </Grid>
      </Backdrop>
      </Paper>
        </Box>
      </Stack>
    </Box>
  );
}

export default LoginLayout;