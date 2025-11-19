import React, { useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { getGuestSessionId } from "../../../utils/guestSession";
import HTMLexam from "../../../components/lessons/learn-html-basics/HTMLexam";

const HTMLexamPage: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      getGuestSessionId();
    }
  }, [user]);

  return <HTMLexam />;
};

export default HTMLexamPage;
