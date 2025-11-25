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
    // Only redirect after loading finishes
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // Prevent rendering UI before we know user state
  if (loading) return null;

  // If user exists → allow rendering children
  return <>{children}</>;
};

export default VerifyToken;
