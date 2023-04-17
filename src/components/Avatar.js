import '../styles/Avatar.css';

import DefaultProfile from '../assets/images/default_profile.jpg';

function Avatar({ imageUrl, size = 'medium' }) {
  return (
    <div
      className={`Avatar ${size}`}
      style={{ backgroundImage: `url(${imageUrl || DefaultProfile})` }}
    ></div>
  );
}

export default Avatar;
