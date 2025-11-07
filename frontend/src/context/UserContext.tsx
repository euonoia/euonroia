import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";  // Import js-cookie for cookie management

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
      const res = await axios.get(`${BACKEND_URL}/auth/me`, { withCredentials: true });  // Ensure cookies are sent
      setUser(res.data.user);  // Use Firebase UID here
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle token from OAuth redirect (from URL query params)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("Token from URL:", token); // Debugging line

    if (token) {
      // Store the token in the HttpOnly, Secure cookie via backend
      fetchUser();

      // Replace URL to avoid exposing the token in the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      fetchUser();  // If token exists in cookies, fetch user data
    }
  }, []);

  // Google OAuth redirect
  const signInWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Sign out and remove token from cookie
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
