import Avatar from '../Avatar/Avatar';
import GroupAvatar from '../GroupAvatar/GroupAvatar';
import IconButton from '../IconButton/IconButton';
import PageHeader from '../PageHeader/PageHeader';
import ContactTab from '../ContactTab/ContactTab';
import '../ContactInfo/ContactInfo.css';
import { auth, createChat } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const GroupInfo = (props) => {
  const navigate = useNavigate();

  const handleTabClick = async (uid) => {
    if (uid === auth.currentUser.uid) return;
    const userIds = [auth.currentUser.uid, uid];
    const chatId = await createChat(userIds);
    navigate(`/chats/${chatId}`);
  };

  return (
    <div className={`ContactInfo ${props.show ? 'show' : ''}`}>
      <PageHeader withBorder={false}>
        <h2>Group info</h2>
        <IconButton name="close" handleClick={props.handleClose} />
      </PageHeader>

      <section>
        {props.profileURL ? (
          <Avatar imageURL={props.profileURL} size="large" />
        ) : (
          <GroupAvatar imageURLs={props.imageURLs} size="large" />
        )}
        <h2>{props.groupName}</h2>
      </section>

      <section>
        <p>
          Members <span className="sml-txt grey">{props.members.length}</span>
          {props.members.map((member) => (
            <ContactTab
              key={member.id}
              userId={member.id}
              handleClick={() => handleTabClick(member.id)}
            />
          ))}
        </p>
      </section>
    </div>
  );
};

export default GroupInfo;
