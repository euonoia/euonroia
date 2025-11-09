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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://euonroia-secured.onrender.com";

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/me`, {
        withCredentials: true, // send cookies
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

  const signInWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/signout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut, signInWithGoogle }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
