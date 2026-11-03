"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken } from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  firebaseLogin: (idToken: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.get<{ user: User }>("/user");
      setUser(data.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: User }>("/login", { email, password });
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.post<{ token: string; user: User }>("/register", { name, email, password });
    setToken(data.token);
    setUser(data.user);
  };

  const firebaseLogin = async (idToken: string) => {
    const data = await api.post<{ token: string; user: User }>("/auth/firebase", { id_token: idToken });
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, firebaseLogin, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
