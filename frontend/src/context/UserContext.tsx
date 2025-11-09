import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// -----------------------------
// Types
// -----------------------------
interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

interface Props {
  children: ReactNode;
}

// -----------------------------
// Context
// -----------------------------
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "https://euonroia-secured.onrender.com";

  // -----------------------------
  // Fetch current user
  // -----------------------------
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ user: User }>(`${BACKEND_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // -----------------------------
  // Sign in
  // -----------------------------
  const signInWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // -----------------------------
  // Sign out
  // -----------------------------
  const signOut = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/signout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

// -----------------------------
// Hook
// -----------------------------
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
