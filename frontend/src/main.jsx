import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import Homepage from './Homepage/Homepage.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    {/* Add your routes or components here */}
    <Homepage />
  </Router>
)
