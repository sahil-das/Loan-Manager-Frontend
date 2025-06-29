import { useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);

  const login = async (email, password, remember) => {
    const res = await axios.post(
      `${API}/auth/login`,
      { email, password, remember },
      {
        withCredentials: true,
      }
    );
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };

  const signup = async (name, email, phone, password) => {
    const res = await axios.post(`${API}/auth/register`, {
      name,
      email,
      phone,
      password,
    });
    return res.data;
  };

  const logout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    setUser(null);
    localStorage.removeItem("user");
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        `${API}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Refresh token failed:", err.response?.data || err.message);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    // Only try to refresh if user exists in localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      refreshToken().finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
