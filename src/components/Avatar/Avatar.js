import './Avatar.css';
import defaultProfileImg from '../../assets/images/default_profile.jpg';

const Avatar = ({ imageURL, size = 'medium' }) => {
  return (
    <div
      className={`Avatar ${size}`}
      style={{ backgroundImage: `url(${imageURL || defaultProfileImg})` }}
    ></div>
  );
};

export default Avatar;
