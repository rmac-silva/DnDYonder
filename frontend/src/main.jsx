import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'

import Homepage from './Homepage/Homepage.jsx'

// Sheets
import Sheet from './Sheets/Sheet.jsx';
import SheetListings from './Sheets/SheetListingsPage/SheetListings.jsx';
import { init as initItemCache } from './Sheets/Inventory/ItemCache';
// Auth
import { AuthProvider } from './Auth/AuthContext.jsx';
import Login from './Auth/Login.jsx';
import Register from './Auth/Register.jsx';

initItemCache().catch(err => console.error('ItemCache init failed', err));

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sheets/:hashedemail" element={<SheetListings />} />
        <Route path="/sheets/:hashedemail/:sheetid" element={<Sheet />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/NewSheet" element={<Sheet />} />
      </Routes>
    </AuthProvider>
  </Router>
)
