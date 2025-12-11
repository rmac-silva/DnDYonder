import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.jsx'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'

import Homepage from './Homepage/Homepage.jsx'

// Sheets
import Sheet from './Sheets/Sheet.jsx';
import SheetListings from './Sheets/SheetListingsPage/SheetListings.jsx';
import { init as initItemCache } from './Sheets/MiddleColumn/Inventory/ItemCache.js';
// Auth
import { AuthProvider } from './Auth/AuthContext.jsx';
import Login from './Auth/Login.jsx';
import Register from './Auth/Register.jsx';

//Admin
import { AdminPage } from './EditingTools/AdminPage.jsx';
import { ItemEditPage } from './EditingTools/Items/ItemEditPage.jsx';
import { ClassEditPage } from './EditingTools/Classes/ClassEditPage.jsx';
import { SubclassEditPage } from './EditingTools/Subclasses/SubclassesEditPage.jsx';
import { SpellEditPage } from './EditingTools/Spells/SpellEditPage.jsx';

// Initialize item cache before rendering app
initItemCache().catch(err => console.error('ItemCache init failed', err));

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
      <Routes>

        
        {/* Home */}
        <Route path="/" element={<Homepage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Sheets */}
        <Route path="/sheets/:username" element={<SheetListings />} />
        <Route path="/sheets/:username/:sheetid" element={<Sheet />} />
        <Route path="/NewSheet" element={<Sheet />} />

        {/* Admin & Editing stuff */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/items" element={<ItemEditPage />} />
        <Route path="/admin/classes" element={<ClassEditPage />} />
        <Route path="/admin/subclasses" element={<SubclassEditPage />} />
        <Route path="/admin/spells" element={<SpellEditPage />} />
        
      </Routes>
      </ThemeProvider>
    </AuthProvider>
  </Router>
)
