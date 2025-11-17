// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosClient from "../utils/axiosClient";
import Cookies from "js-cookie";
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
      const csrfToken = Cookies.get("csrfToken"); // make sure you import js-cookie
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

  const signInWithGoogle = () => {
    setLoginError(false);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const signOut = async () => {
    try {
      await axiosClient.post("/auth/signout"); // CSRF header automatically attached
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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
