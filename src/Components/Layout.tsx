import Grid from '@mui/material/Grid2';
import LeftBar from './LeftBar';
import { Outlet, useNavigate } from 'react-router-dom';

/*const views: {name: string, component: FC, args: object}[] = [
  {name: "projects", component: ListView, args: {projectView: true}},
  {name: "templates", component: ListView, args: {projectView: false}},
  {name: "settings", component: Settings, args: {}}
]*/

const Layout = () => {

  const navigate = useNavigate()

  return (
    
    <Grid container>
      {/* <Stack height={"100vh"} direction="row" bgcolor={"background.default"} color={"text.primary"}> */}
        <Grid size={{xs: 12, sm: 5, md: 3, lg: 2}} /*sx={{ backgroundColor: {xs: "red", sm: "purple", md: "green", lg: "blue", xl: "gray"}}}*/>
          <LeftBar setSection={(to: string) => navigate(`/${to}`)} />
        </Grid>
        <Grid size={{xs: 12, sm: 7, md: 9, lg: 10}} sx={{p: "0 1em"}}>
        {/* <Box pl={2} pr={2}> */}
            <Outlet/>
        {/* </Box> */}
        </Grid>
      {/* </Stack> */}
    </Grid>
  );
}

export default Layout;

/*
<Box width={700}>
{views.map((view, index) =>
  <Box sx={{display: section===view.name ? "block" : "none"}}>
    {React.createElement(view.component, view.args, '')}
  </Box>
)}
</Box>
*/