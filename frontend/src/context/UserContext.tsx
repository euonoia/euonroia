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
  signInWithGoogle: () => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Backend is proxied via Nginx at /auth
  const BACKEND_URL = "/auth";

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/me`, {
        withCredentials: true, // cookies sent automatically
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
    // Redirect user to backend Google OAuth route
    window.location.href = `${BACKEND_URL}/google`;
  };

  const signOut = async () => {
    try {
      await axios.post(`${BACKEND_URL}/signout`, {}, { withCredentials: true });
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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
