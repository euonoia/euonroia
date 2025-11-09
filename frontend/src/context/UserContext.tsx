import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
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

interface UserProviderProps {
  children: ReactNode;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Provide a **fallback object** to prevent undefined access
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  signInWithGoogle: () => {},
  signOut: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ user: User }>(`${BACKEND_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Fetch user failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signInWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/signout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};
