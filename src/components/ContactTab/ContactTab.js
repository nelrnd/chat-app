import useUserData from '../../hooks/useUserData';
import Avatar from '../Avatar/Avatar';
import './ContactTab.css';

const ContactTab = ({ userId, handleClick, children }) => {
  const [userData, loading] = useUserData(userId);

  if (loading) return null;

  return (
    <div
      className={`ContactTab ${!handleClick ? 'off' : ''}`}
      onClick={handleClick || null}
    >
      <Avatar imageURL={userData.profileURL} size="small" />

      <div className="col gap-2">
        <h3>{userData.name}</h3>
        <p className="sml-txt grey">{userData.email}</p>
      </div>

      {children}
    </div>
  );
};

export default ContactTab;
