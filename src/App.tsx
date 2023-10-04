import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, CssBaseline, Stack, Typography } from '@mui/material';
import LeftBar from './Components/LeftBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import Projects from './Pages/TemplateList';
import Login from './Pages/Login';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' index element={<Layout section='projects' />} />
        <Route path='/projects' element={<Layout section='projects' />} />
        <Route path='/templates' element={<Layout section='templates' />} />
        <Route path='/settings' element={<Layout section='settings' />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

