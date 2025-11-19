import JavaScriptExamContent from './contents/JavaScriptExamContent';
import VerifyToken from '../../../components/auth/VerifyToken';

const JavaScriptExam: React.FC = () => (
  <VerifyToken>
    <JavaScriptExamContent />
  </VerifyToken>
);

export default JavaScriptExam;
