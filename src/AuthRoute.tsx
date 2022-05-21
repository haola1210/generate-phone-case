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
      return <Navigate to="/generate-phone-case/" replace />
    }
  } else {
    if(user) {
      return <Navigate to="/generate-phone-case/home" replace />
    } else {
      return <Outlet />
    }
  }
}

export default AuthRoute;