import React, { useEffect } from "react";
import HTMLelementsContent from "../../../components/lessons/learn-html-basics/HTMLelements";
import { useUser } from "../../../context/UserContext";
import { getGuestSessionId } from "../../../utils/guestSession";

const HTMLelements: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      getGuestSessionId();
    }
  }, [user]);

  return <HTMLelementsContent />;
};

export default HTMLelements;
