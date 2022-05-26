import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from './UserContext'
import { BASE_NAME } from "./utils"
type AuthRouteProps = {
  type: 'private' | 'public'
}
function AuthRoute({ type } : AuthRouteProps) {
  const { user } = useUserContext()
  
  if(type === 'private'){
    if(user){
      return <Outlet />
    } else {
      return <Navigate to={BASE_NAME + "/"} replace />
    }
  } else {
    if(user) {
      return <Navigate to={BASE_NAME + "/home"} replace />
    } else {
      return <Outlet />
    }
  }
}

export default AuthRoute;