import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game/Game';
import Home from './components/Home/Home';
import './App.css';

function App() {
	return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:hash" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
