import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import OverviewView from './views/OverviewView';
import SignUp from './components/SignUp';
import { Box, Container, createTheme, ThemeProvider, Toolbar, useScrollTrigger } from '@mui/material';
import OpeningHoursView from './views/OpeningHoursView';
import TicketPricesView from './views/TicketPricesView';

export const redTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ED254E',
      contrastText: '#1D1E2A',
    },
    secondary: {
      main: '#1D1E2A',
    },

  },
});

function App() {
  return (
    <ThemeProvider theme={redTheme}>
      <BrowserRouter>
          <Header></Header>
        <Toolbar />
        <Container maxWidth="lg">
          <Box className='App_box' sx={{ height: '95vh' }} >
            <Routes>
              <Route path="/" element={<OverviewView />} />
              <Route path="/signIn" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/openingHours" element={<OpeningHoursView />} />
              <Route path="/ticketPrices" element={<TicketPricesView />} />
            </Routes>
          </Box>
        </Container>
      </BrowserRouter>
    </ThemeProvider >
  );
}

export default App;
