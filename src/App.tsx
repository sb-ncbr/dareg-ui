import React, { useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, CssBaseline, Stack, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material';
import LeftBar from './Components/LeftBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import Projects from './Pages/TemplateList';
import Login from './Pages/Login';
import ProjectsList from './Pages/ProjectList';
import TemplateList from './Pages/TemplateList';
import Settings from './Pages/Settings';
import ListCard from './Components/ListCard';
import NewDataset from './Components/NewDataset';
import DatasetCard from './Components/DatasetCard';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [selectedTheme, setSelectedTheme] = useState<"dark"|"light"|"system">("system")
  const darkTheme = createTheme({
    palette: {
      mode: selectedTheme==="system" ? (prefersDarkMode ? "dark" : "light") : selectedTheme
    }
  })


  return (
    <>
      <CssBaseline/>
      <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />} >
            <Route path='projects/:projId' element={<ListCard/>} >
              <Route path='new' element={<NewDataset/>} />
            </Route>
            <Route path='projects' element={<ProjectsList />} />
            <Route path='projects/:projId/:datasetId' element={<DatasetCard />} />
            <Route path='templates' element={<TemplateList />} />
            <Route path='settings' element={<Settings selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;

