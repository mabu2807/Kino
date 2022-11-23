import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import OverviewView from './views/OverviewView';

function App() {
  return (
    <BrowserRouter>
    <div> 
      <Header></Header>
      <Routes>     
        <Route path="/" element={<OverviewView />} />     
        <Route path="/header" element={<Header />} />
      </Routes>
    </div>
  </BrowserRouter>      
  );
}

export default App;
