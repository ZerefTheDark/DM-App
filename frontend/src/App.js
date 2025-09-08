import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BattleMap from './components/BattleMap';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BattleMap />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;