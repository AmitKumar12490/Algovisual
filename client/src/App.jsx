import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import Comparison from './pages/Comparison';
import History from './pages/History';
import About from './pages/About';
import { HistoryProvider } from './context/HistoryContext';

export default function App() {
  return (
    <HistoryProvider>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/history"    element={<History />} />
        <Route path="/about"      element={<About />} />
      </Routes>
    </HistoryProvider>
  );
}
