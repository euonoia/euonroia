import JavaScriptDisplayContent from './contents/JavaScriptDisplayContent';
import VerifyToken from '../../../components/auth/VerifyToken';

const JavaScriptDisplay: React.FC = () => (
  <VerifyToken>
    <JavaScriptDisplayContent />
  </VerifyToken>
);

export default JavaScriptDisplay;