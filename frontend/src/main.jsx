import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import Homepage from './Homepage/Homepage.jsx'
import Sheet from './Sheets/Sheet.jsx';
import SheetListings from './Sheets/SheetListings.jsx';
import { Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/sheets" element={<SheetListings />} />
      <Route path="/login" element={<Homepage />} />
      <Route path="/NewSheet" element={<Sheet />} />
    </Routes>
  </Router>
)
