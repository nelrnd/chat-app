import '../styles/Avatar.css';
import DefaultProfile from '../assets/images/default_profile.jpg';

function Avatar({ imageURL, size = 'medium' }) {
  return (
    <div
      className={`Avatar ${size}`}
      style={{ backgroundImage: `url(${imageURL || DefaultProfile})` }}
    ></div>
  );
}

export default Avatar;
