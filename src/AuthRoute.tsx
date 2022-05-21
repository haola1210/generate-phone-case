import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from './UserContext'
type AuthRouteProps = {
  type: 'private' | 'public'
}
function AuthRoute({ type } : AuthRouteProps) {
  const { user } = useUserContext()
  
  if(type === 'private'){
    if(user){
      return <Outlet />
    } else {
      return <Navigate to="/" replace />
    }
  } else {
    if(user) {
      return <Navigate to="/home" replace />
    } else {
      return <Outlet />
    }
  }
}

export default AuthRoute;