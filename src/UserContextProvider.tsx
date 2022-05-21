import React, { ReactPropTypes, useState } from 'react';
import UserContext from './UserContext';

const getHistoryInfo = () => {
  const json = localStorage.getItem('black')
  if(!json) return ''
  
  const data : { u: string, t: number } = JSON.parse(json)
  const { u, t } = data

  if((new Date).getTime() > t) return ''
  
  return u
}

function UserContextProvider({ children } : { children : JSX.Element }) {
  const [user, setUser] = useState(getHistoryInfo)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContextProvider;