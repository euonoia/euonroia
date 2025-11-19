import { ReactNode } from "react";
import { useUser } from "../../context/UserContext";

interface Props {
  children: ReactNode;
}

const VerifyToken = ({ children }: Props) => {
  const { loading } = useUser();

  // While user is still loading, avoid flashing UI
  if (loading) return null;

  // No redirect — guests are allowed
  return <>{children}</>;
};

export default VerifyToken;
