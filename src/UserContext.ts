import { createContext, useContext } from "react";
type UserContextType = {
  user: string; 
  setUser: React.Dispatch<React.SetStateAction<string>>; 
}

const UserContext = createContext<UserContextType>({} as UserContextType)

const useUserContext = () => useContext(UserContext);

export default UserContext
export { useUserContext }