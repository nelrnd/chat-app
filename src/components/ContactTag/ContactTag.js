import useUserData from '../../hooks/useUserData';
import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import './ContactTag.css';

const ContactTag = ({ userId, handleClick }) => {
  const [userData] = useUserData(userId);

  if (!userData) return null;

  return (
    <div className="ContactTag" onClick={handleClick}>
      <Avatar imageURL={userData.profileURL} size="mini" />
      <h3>{userData.name}</h3>
      <Icon name="close" size="small" />
    </div>
  );
};

export default ContactTag;
