import React from 'react'
import ReactDOM from 'react-dom/client'
import { storage } from './firebase.js'
import App from './App.jsx'

// Wire Firebase storage into window.storage so the app code works unchanged
window.storage = storage;

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
