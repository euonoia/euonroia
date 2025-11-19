import HTMLdocumentContent from './contents/HTMLdocumentContent';
import VerifyToken from '../../../components/auth/VerifyToken';

const HTMLdocument: React.FC = () => (
  <VerifyToken>
    <HTMLdocumentContent />
  </VerifyToken>
);

export default HTMLdocument;
