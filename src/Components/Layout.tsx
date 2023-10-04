import { Box, CssBaseline, Divider, List, Stack, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import LeftBar from './LeftBar';
import { Outlet, useOutletContext } from 'react-router-dom';
import Settings from '../Pages/Settings';
import ProjectsList from '../Pages/ProjectList';
import TemplateList from '../Pages/TemplateList';

/*const views: {name: string, component: FC, args: object}[] = [
  {name: "projects", component: ListView, args: {projectView: true}},
  {name: "templates", component: ListView, args: {projectView: false}},
  {name: "settings", component: Settings, args: {}}
]*/

const Layout = (props: {section: string}) => {
  const [section, setSection] = useState(props.section)
  const clickSection = (section: string) => {
    setSection(section)
    window.history.replaceState(null, "Ceitec", `/${section}`)
    //window.scrollTo(0, 1000);
  }

  const leftBarBox = useRef<any>(null)
  const [leftBarWidth, setLeftBarWidth] = useState(0)
  useEffect(() => {
    setLeftBarWidth(leftBarBox.current.offsetWidth)
  } ,[])

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [selectedTheme, setSelectedTheme] = useState<"dark"|"light"|"system">("system")
  const darkTheme = createTheme({
    palette: {
      mode: selectedTheme==="system" ? (prefersDarkMode ? "dark" : "light") : selectedTheme
    }
  })

  //const [selectedTheme, setSelectedTheme] = useOutletContext<any>()

  return (
    <Box>
      <CssBaseline/>
      <ThemeProvider theme={darkTheme}>
        <Stack direction="row" justifyContent="center" height="100vh" bgcolor={"background.default"} color={"text.primary"}>
          <Box minWidth={leftBarWidth}>
            <Box position="fixed" ref={leftBarBox}>
              <LeftBar section={section} setSection={clickSection} />
            </Box>
          </Box>
          <Box width={900}>
            <Box sx={{display: section==="projects" ? "block" : "none"}}>
              <ProjectsList/>
            </Box>
            <Box sx={{display: section==="templates" ? "block" : "none"}}>
              <TemplateList/>
            </Box>
            <Box sx={{display: section==="account" ? "block" : "none"}}>
              <Settings selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>
            </Box>
            <Box sx={{display: section==="settings" ? "block" : "none"}}>
              <Settings selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>
            </Box>
          </Box>
        </Stack>
      </ThemeProvider>
    </Box>  
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