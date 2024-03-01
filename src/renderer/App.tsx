import './App.css';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import RaceHome from 'components/RaceHome';
import Settings from 'components/Settings';
import Sidebar from 'components/Sidebar';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#606060',
    },
  },
  typography: {
    fontFamily: ['"Segoe UI"'].join(','),
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app">
          <Sidebar />
          <div id="content">
            <Routes>
              <Route path="/" element={<RaceHome />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
