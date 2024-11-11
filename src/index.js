// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fetch role from localStorage
const role = localStorage.getItem('userRole') || 'Mother'; // Set default to 'Mother' for testing
ReactDOM.createRoot(document.getElementById('root')).render(<App role={role} />);