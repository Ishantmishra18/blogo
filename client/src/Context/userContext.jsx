// src/context/UserContext.js
import React ,{ createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user on mount (refresh-safe)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error("User fetch failed", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);