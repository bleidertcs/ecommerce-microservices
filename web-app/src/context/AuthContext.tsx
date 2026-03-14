"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCasdoorLogoutUrl } from "@/lib/casdoor-config";
import { trackEvent } from "@/lib/tracing.client";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem("lumina_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("lumina_token", newToken);
    setToken(newToken);
    trackEvent("user.login.success", { 
      auth_method: "casdoor",
      timestamp: new Date().toISOString()
    });
    router.push("/products"); // Redirect to products after login
  };

  const logout = () => {
    // Clear local session immediately for snappy UI
    localStorage.removeItem("lumina_token");
    setToken(null);
    
    trackEvent("user.logout", { 
      timestamp: new Date().toISOString()
    });

    // Clear Casdoor session in background
    const logoutUrl = getCasdoorLogoutUrl();
    fetch(logoutUrl, { mode: 'no-cors', keepalive: true })
      .catch(err => console.error("Background logout cleanup failed:", err));

    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
