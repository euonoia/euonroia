import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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

const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props { children: ReactNode; }

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch user from /me
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/me`, { withCredentials: true });
      setUser(res.data.user || null);
    } catch (err) {
      // Try refreshing access token if /me fails
      try {
        await axios.post(`${BACKEND_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const res = await axios.get(`${BACKEND_URL}/auth/me`, { withCredentials: true });
        setUser(res.data.user || null);
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchUser();

    // Optional: auto-refresh access token every 12 hours
    const interval = setInterval(() => {
      axios.post(`${BACKEND_URL}/auth/refresh-token`, {}, { withCredentials: true }).catch(() => {});
    }, 12 * 60 * 60 * 1000); // 12 hours

    return () => clearInterval(interval);
  }, [fetchUser, BACKEND_URL]);

  const signInWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/signout`, {}, { withCredentials: true });
    } catch {}
    setUser(null);
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut, signInWithGoogle, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
