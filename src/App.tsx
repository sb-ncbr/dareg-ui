import { useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import Login from './Pages/Login';
import ProjectsList from './Pages/Projects/ProjectList';
import TemplateList from './Pages/Templates/TemplateList';
import DatasetCard from './Components/DatasetCard';
import { useAuth } from 'react-oidc-context';
import LoginLayout from './Components/LoginLayout';
import AuthenticatedRoute from './Components/AuthenticatedRoute';
import OIDCCallback from './Components/OIDCCallback';
import Profile from './Pages/Profile';
import TemplatesNew from './Pages/Templates/TemplatesEdit';
import TemplateView from './Pages/Templates/TemplateView';
import { CachePolicies, Provider } from 'use-http';
import { User } from 'oidc-client-ts';
import config from './Config';
import ProjectEdit from './Pages/Projects/ProjectEdit';
import DatasetView from './Pages/Datasets/DatasetView';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [selectedTheme, setSelectedTheme] = useState<"dark"|"light"|"system">("system")
  const darkTheme = createTheme({
    palette: {
      mode: selectedTheme==="system" ? (prefersDarkMode ? "light" : "dark") : selectedTheme
    }
  })
  const auth = useAuth()

const getUser = () => {
  const oidcStorage = sessionStorage.getItem(`oidc.user:${config.REACT_APP_OIDC_AUTHORITY}:${config.REACT_APP_OIDC_CLIENT_ID}`)
  if (!oidcStorage) {
      return null;
    }
  return User.fromStorageString(oidcStorage);
}

const options = {
  interceptors: {
    request: ({ options, url, path, route }: any) => {
      const u = getUser();
      options.headers.Authorization = `Bearer ${u?.id_token}`
      return options
    }
  },
  "headers": {
    "Content-Type": "application/json"
  },
  cachePolicy: CachePolicies.NO_CACHE,
  retries: 0,
  retryOn: async ({ attempt, error, response }: any) => {
    // returns true or false to determine whether to retry
    return error || response && response.status >= 300
  },

  retryDelay: ({ attempt, error, response }: any) => {
    // exponential backoff
    return Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
    // linear backoff
    return attempt * 1000
  }
}

  return (
    <Provider url='http://localhost:5000/api' options={options}>
      <BrowserRouter>
        <CssBaseline/>
        <ThemeProvider theme={darkTheme}>
              <Routes>
                <Route element={<AuthenticatedRoute />}>
                  <Route path='/' element={<Layout />} >
                    <Route index element={<ProjectsList />} />

                    <Route path='projects'>
                      <Route index element={<ProjectsList />} />
                      <Route path='new' element={<ProjectEdit mode={'new'} />} />
                      <Route path=':projectId' element={<ProjectEdit mode={'view'} />} />
                      <Route path=':projectId/edit' element={<ProjectEdit mode={'edit'} />} />
                      <Route path=':projectId/datasets' element={<DatasetCard />} />
                      <Route path=':projectId/datasets/new' element={<DatasetView mode={'new'} />} />
                      <Route path=':projectId/datasets/:datasetId' element={<DatasetView mode='view' />} />
                      <Route path=':projectId/datasets/:datasetId/edit' element={<DatasetView mode='edit' />} />
                      {/* <Route path=':projId'>
                        <Route index element={<ListCard/>} />
                        <Route path='dataset' element={<DatasetCard />}>
                          <Route path=':datasetId/edit' element={<ProjectEdit editMode={true} />} />
                        </Route>
                      </Route> */}
                    </Route>
                    
                    <Route path='templates'>
                      <Route index element={<TemplateList />} />
                      <Route path=':templateId' element={<TemplateView />}>
                      </Route>
                      <Route path=':templateId/edit' element={<TemplatesNew editMode={true} />} />
                      <Route path='new' element={<TemplatesNew editMode={false} />} />
                    </Route>
                    
                    <Route path='account' element={<Profile selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />} />
                  </Route>
                </Route>
                <Route element={<LoginLayout />} >
                  <Route path='login' element={<Login/>} />
                  <Route path="/auth" element={< OIDCCallback />} />
                </Route>
              </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

