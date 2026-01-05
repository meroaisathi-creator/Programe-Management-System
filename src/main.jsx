import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // यहाँ 'App.jsx' वा 'HealthBranchApp.jsx' जुन नाम राख्नुभएको छ त्यही लेख्नुहोला
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)