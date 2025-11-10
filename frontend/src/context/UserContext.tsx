// src/context/UserContext.tsx
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
  loginError: boolean;
  setLoginError: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user || null);
      setLoginError(false); // ✅ Clear error if user fetch succeeds
    } catch (err: any) {
      console.warn("Auth check failed:", err?.response?.status || err.message);
      setUser(null);

      // Check if the user came from Google login (failed due to blocked cookies)
      const url = new URL(window.location.href);
      const fromGoogle = url.searchParams.has("code") || url.searchParams.has("state");

      // ✅ Always show LoginWarning if auth/me failed
      setLoginError(true);

      if (fromGoogle) {
        console.warn("Google login likely failed — blocked cookies.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signInWithGoogle = () => {
    setLoginError(false);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/signout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        loginError,
        setLoginError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
