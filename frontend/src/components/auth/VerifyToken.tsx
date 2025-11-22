import { ReactNode, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const VerifyToken = ({ children }: Props) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // No user → token missing or expired → redirect
      if (!user) {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Prevent UI flash while loading user state
  if (loading) return null;

  // If user exists → allow rendering children
  return <>{children}</>;
};

export default VerifyToken;
