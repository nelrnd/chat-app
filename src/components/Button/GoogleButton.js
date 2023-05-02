import './GoogleButton.css';
import './GoogleButton.css';
import { ReactComponent as GoogleIcon } from '../../assets/icons/google.svg';

const GoogleButton = ({ text, handleClick }) => {
  return (
    <button className="GoogleButton" type="button" onClick={handleClick}>
      <GoogleIcon />
      {text}
    </button>
  );
};

export default GoogleButton;
