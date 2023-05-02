import './GoogleButton.css';
import './GoogleButton.css';
import { ReactComponent as GoogleIcon } from '../../assets/icons/google.svg';

const GoogleButton = ({ text }) => {
  return (
    <button className="GoogleButton" type="button">
      <GoogleIcon />
      {text}
    </button>
  );
};

export default GoogleButton;
