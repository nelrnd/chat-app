import useUserData from '../../hooks/useUserData';
import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import './ContactTab.css';

const ContactTab = ({ userId, check, handleClick }) => {
  const [userData, loading] = useUserData(userId);

  if (loading) return null;

  return (
    <div className="ContactTab" onClick={handleClick}>
      <Avatar imageURL={userData.profileURL} size="small" />

      <div className="col gap-2">
        <h3>{userData.name}</h3>
        <p className="sml-txt grey">{userData.email}</p>
      </div>

      {check && <Icon name="check" size="small" />}
    </div>
  );
};

export default ContactTab;
