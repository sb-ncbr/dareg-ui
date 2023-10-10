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
import SchemeCard from './Components/SchemeCard';

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
            <Route index element={<ProjectsList />} />
            
            <Route path='projects'>
              <Route index element={<ProjectsList />} />
              <Route path=':projId'>
                <Route index element={<ListCard/>} />
                <Route path='new' element={<NewDataset/>} />
                <Route path=':datasetId' element={<DatasetCard />} />
              </Route>
            </Route>
            
            <Route path='templates'>
              <Route index element={<TemplateList />} />
              <Route path=':templateId' element={<SchemeCard />} />
            </Route>
            
            <Route path='settings' element={<Settings selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;

