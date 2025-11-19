// src/pages/lessons/html-basics/HTMLdocument.tsx
import React, { useEffect } from "react";
import HTMLdocumentContent from "../../../components/lessons/learn-html-basics/HTMLdocument";
import { useUser } from "../../../context/UserContext";
import { getGuestSessionId } from "../../../utils/guestSession";

const HTMLdocument: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    // Ensure guest session exists for non-logged-in users
    if (!user) {
      getGuestSessionId(); // creates or retrieves sessionId cookie
    }
  }, [user]);

  return <HTMLdocumentContent />;
};

export default HTMLdocument;
