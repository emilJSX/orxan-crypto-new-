import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // <-- Проверить точный путь. Если index.css лежит в src, то './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)