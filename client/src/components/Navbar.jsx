import React from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import './Navbar.css';

export default function Navbar() {
  const { runs } = useHistory();
  return (
    <nav className="navbar">
      <div className="nav-brand">algo<span>conv</span>.</div>
      <div className="nav-links">
        <NavLink to="/"          className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
        <NavLink to="/visualizer" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Visualizer</NavLink>
        <NavLink to="/comparison" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Comparison</NavLink>
        <NavLink to="/history"   className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
          History {runs.length > 0 && <span className="nav-badge">{runs.length}</span>}
        </NavLink>
        <NavLink to="/about"     className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>About</NavLink>
      </div>
    </nav>
  );
}
