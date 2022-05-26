import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom"
import UserContextProvider from "./UserContextProvider"
import AuthRoute from './AuthRoute'
import Login from './Login'
import { BASE_NAME } from "./utils"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path={BASE_NAME + "/home"} element={<AuthRoute type='private' />}>
            <Route index element={<App />} />
          </Route>
          <Route path={BASE_NAME + "/"} element={<AuthRoute type='public' />}>
            <Route index element={<Login />} />
          </Route>
          <Route path={'*'} element={<Navigate to={BASE_NAME + "/"} replace />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
)
