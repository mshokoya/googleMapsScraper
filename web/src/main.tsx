import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import { GlobalContextWrap } from './core/context.js'
import './index.css'
import { io } from './core/websocket';

io.startWebSocketServer()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalContextWrap>
      <App />
    </GlobalContextWrap>
  </React.StrictMode>,
)
