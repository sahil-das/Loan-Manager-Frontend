import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (email, password, remember) => {
    const res = await axios.post(`${API}/auth/login`, { email, password, remember }, {
      withCredentials: true
    });
    setUser(res.data.user);
  };

  const signup = async (name, email, password) => {
    const res = await axios.post(`${API}/auth/register`, { name, email, password });
    return res.data;
  };

  const logout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(`${API}/auth/refresh-token`, {}, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshToken().finally(() => setAuthLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
