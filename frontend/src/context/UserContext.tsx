import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Get JWT from localStorage
  const getToken = () => localStorage.getItem("authToken");

  // Fetch current user with token
  const fetchUser = async (token?: string) => {
    const authToken = token || getToken();
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle token from OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      fetchUser(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      fetchUser();
    }
  }, []);

  // Google OAuth redirect
  const signInWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Sign out
  const signOut = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut, signInWithGoogle }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to access context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
