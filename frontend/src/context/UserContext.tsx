import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosClient from "../utils/axiosClient";
import Cookies from "js-cookie";

interface User {
  uid: string;      // Use "uid" to match backend JWT
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

  // --- Fetch current user from backend
  const fetchUser = async () => {
    setLoading(true);
    try {
      const csrfToken = Cookies.get("euonroiaCsrfToken"); // aligned with backend
      const res = await axiosClient.post(
        "/auth/me",
        {},
        {
          headers: { "x-csrf-token": csrfToken || "" },
          withCredentials: true,
        }
      );

      setUser(res.data.user || null);
      setLoginError(false);
    } catch (err: any) {
      console.warn("Auth check failed:", err?.response?.status || err.message);
      setUser(null);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // --- Redirect to Google OAuth
  const signInWithGoogle = () => {
    setLoginError(false);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // --- Sign out user
  const signOut = async () => {
    try {
      const csrfToken = Cookies.get("euonroiaCsrfToken");
      await axiosClient.post(
        "/auth/signout",
        {},
        {
          headers: { "x-csrf-token": csrfToken || "" },
          withCredentials: true,
        }
      );
      setUser(null);
      window.location.href = "/";
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

// --- Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
