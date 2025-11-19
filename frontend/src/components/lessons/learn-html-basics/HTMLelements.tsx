import HTMLelementsContent from './contents/HTMLelementsContent';
import VerifyToken from '../../../components/auth/VerifyToken';

const HTMLelements: React.FC = () => (
  <VerifyToken>
    <HTMLelementsContent />
  </VerifyToken>
);

export default HTMLelements;
