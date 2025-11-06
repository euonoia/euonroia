import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  signInWithGoogle: () => void;
  fetchUser: () => Promise<void>;
}

// Set Axios defaults globally
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "https://euonroia-secured.onrender.com";

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch current user
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data.user || null);
    } catch (err) {
      console.warn("Access token invalid, trying refresh...");
      try {
        await axios.post("/auth/refresh-token");
        const res = await axios.get("/auth/me");
        setUser(res.data.user || null);
      } catch (refreshErr) {
        console.error("Failed to refresh user:", refreshErr);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, fetch user + auto-refresh token every 12h
  useEffect(() => {
    fetchUser();

    const interval = setInterval(() => {
      axios.post("/auth/refresh-token").catch(() => {});
    }, 12 * 60 * 60 * 1000); // 12 hours

    return () => clearInterval(interval);
  }, [fetchUser]);

  const signInWithGoogle = () => {
    window.location.href = `${axios.defaults.baseURL}/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.post("/auth/signout");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
    setUser(null);
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut, signInWithGoogle, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
