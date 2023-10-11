import { useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import Login from './Pages/Login';
import ProjectsList from './Pages/ProjectList';
import TemplateList from './Pages/TemplateList';
import Settings from './Pages/Settings';
import ListCard from './Components/ListCard';
import NewDataset from './Components/NewDataset';
import DatasetCard from './Components/DatasetCard';
import SchemeCard from './Components/SchemeCard';
import { AuthProvider } from 'react-oidc-context';
import LoginLayout from './Components/LoginLayout';
import config from './Config';
import AuthenticatedRoute from './Components/AuthenticatedRoute';
import OIDCCallback from './Components/OIDCCallback';
import Profile from './Components/Profile';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [selectedTheme, setSelectedTheme] = useState<"dark"|"light"|"system">("system")
  const darkTheme = createTheme({
    palette: {
      mode: selectedTheme==="system" ? (prefersDarkMode ? "dark" : "light") : selectedTheme
    }
  })

  const oidcConfig = {
    authority: config.REACT_APP_OIDC_AUTHORITY,
    client_id: config.REACT_APP_OIDC_CLIENT_ID,
    scope: config.REACT_APP_OIDC_SCOPE,
    response_type: "code",
    // In case of e-infra cz use http://localhost:3000
    redirect_uri: (new URL(config.REACT_APP_OIDC_REDIRECT_URL, window.location.origin)).href,
    metadata: {
      issuer: config.REACT_APP_OIDC_METADATA_issuer,
      jwks_uri: config.REACT_APP_OIDC_METADATA_jwks_uri,
      authorization_endpoint: config.REACT_APP_OIDC_METADATA_authorization_endpoint,
      token_endpoint: config.REACT_APP_OIDC_METADATA_token_endpoint,
      userinfo_endpoint: config.REACT_APP_OIDC_METADATA_userinfo_endpoint,
      end_session_endpoint: config.REACT_APP_OIDC_METADATA_end_session_endpoint,
    },
    automaticSilentRenew: false,
    checkSessionIntervalInSeconds: 3600
  };

  return (
    <>
      <AuthProvider {...oidcConfig}>
        <CssBaseline/>
        <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
              <Routes>
                <Route element={<AuthenticatedRoute />}>
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

                    <Route path='account' element={<Profile />} />
                  </Route>
                </Route>
                <Route element={<LoginLayout />} >
                  <Route path='login' element={<Login/>} />
                  <Route path="/auth" element={< OIDCCallback />} />
                </Route>
              </Routes>
            </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;

