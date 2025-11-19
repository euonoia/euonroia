import React from "react";
import PasteToQuizContent from "./pastetocodecontent"; // the component we just wrote
import VerifyToken from "../../components/auth/VerifyToken";

const PasteToQuiz: React.FC = () => (
  <VerifyToken>
    <PasteToQuizContent />
  </VerifyToken>
);

export default PasteToQuiz;
