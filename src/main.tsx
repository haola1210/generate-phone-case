import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import UserContextProvider from "./UserContextProvider"
import AuthRoute from './AuthRoute'
import Login from './Login'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<AuthRoute type='private' />}>
            <Route index element={<App />} />
          </Route>
          <Route path="/" element={<AuthRoute type='public' />}>
            <Route index element={<Login />} />
          </Route>
          <Route path='/*' element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
)
