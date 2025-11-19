import JavaScriptConditionContent from './contents/JavaScriptConditions';
import VerifyToken from '../../../components/auth/VerifyToken';

const JavaScriptConditions: React.FC = () => (
  <VerifyToken>
    <JavaScriptConditionContent />
  </VerifyToken>
);

export default JavaScriptConditions;