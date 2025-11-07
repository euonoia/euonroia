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

  // Fetch current user with token (from cookies)
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/me`, { withCredentials: true }); // Send cookies with request
      setUser(res.data.user);  // Use Firebase UID here
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle token from OAuth redirect
  useEffect(() => {
    fetchUser();  // Automatically check the user's status on page load
  }, []);

  // Google OAuth redirect
  const signInWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Sign out and remove token by clearing the cookie on the backend
  const signOut = async () => {
    await axios.post(`${BACKEND_URL}/auth/signout`, {}, { withCredentials: true });
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
