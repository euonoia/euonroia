import HTMLexamContent from './contents/HTMLexamContent';
import VerifyToken from '../../../components/auth/VerifyToken';

const HTMLexam: React.FC = () => (
  <VerifyToken>
    <HTMLexamContent />
  </VerifyToken>
);

export default HTMLexam;
