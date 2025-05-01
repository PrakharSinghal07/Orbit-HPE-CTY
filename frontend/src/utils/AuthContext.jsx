import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    checkAuth();
  });

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("accessToken");
    const tokenExpiry = localStorage.getItem("accessExpires");
    if (storedToken && tokenExpiry) {
      const isTokenExpired = new Date(tokenExpiry) < new Date();
      if (!isTokenExpired) {
        setAccessToken(storedToken);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } else {
      logout();
    }
  };
  
  const login = (accessToken, accessExpires) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessExpires", accessExpires);
    setAccessToken(accessToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessExpires");
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
