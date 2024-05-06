import React from 'react'
import { Routes, Route } from "react-router-dom"
import Sidebar from './sidebar/Sidebar.js';
import Dashboard from './pages/Dashboard.js'; 
import Mint from './pages/Mint.js';
import Transfer from './pages/Transfer';
import NFT from './pages/Nft' 
const App = () => {
  return (
    <Sidebar> 
        <Routes>
         
        <Route path="/" element={<Dashboard />} />
          <Route path='/mint' element={<Mint />} />
          <Route path='/transfer' element={<Transfer />} />
          <Route path='/nft' element={<NFT />} />
          
        </Routes>
        </Sidebar>
      
  );
}

export default App;
