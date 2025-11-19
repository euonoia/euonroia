import SampleContent from './contents/JavascriptSample';
import VerifyToken from '../../../components/auth/VerifyToken';

const Sample: React.FC = () => (
  <VerifyToken>
    <SampleContent />
  </VerifyToken>
);

export default Sample;
