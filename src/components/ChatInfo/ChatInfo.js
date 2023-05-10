import { useNavigate } from 'react-router-dom';
import { capitalize, getChatName } from '../../utils';
import Avatar from '../Avatar/Avatar';
import ContactTab from '../ContactTab/ContactTab';
import GroupAvatar from '../GroupAvatar/GroupAvatar';
import IconButton from '../IconButton/IconButton';
import PageHeader from '../PageHeader/PageHeader';
import './ChatInfo.css';
import { createChat } from '../../firebase';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const ChatInfo = ({
  chat,
  users,
  userId,
  show,
  handleClose,
  openEditModal,
  openManageModal,
}) => {
  let type = users.length === 2 ? 'contact' : 'group';
  let otherUsers = users.filter((u) => u.id !== userId);

  return (
    <>
      <aside className={`ChatInfo ${show ? 'show' : ''}`}>
        <PageHeader withBorder={false}>
          <h2>{capitalize(type)} info</h2>
          <IconButton name="close" handleClick={handleClose} />
        </PageHeader>

        {type === 'contact' ? (
          <ContactInfo user={otherUsers[0]} />
        ) : (
          <GroupInfo
            chat={chat}
            users={users}
            userId={userId}
            handleClose={handleClose}
            openEditModal={openEditModal}
            openManageModal={openManageModal}
          />
        )}
      </aside>
      <div className="ChatInfo_backdrop" onClick={handleClose} />
    </>
  );
};

const ContactInfo = ({ user }) => {
  return (
    <>
      <section className="info">
        <Avatar imageURL={user.profileURL} size="large" />
        <h2>{user.name}</h2>
        <p className="grey">{user.email}</p>
      </section>
    </>
  );
};

const GroupInfo = ({
  chat,
  users,
  userId,
  handleClose,
  openEditModal,
  openManageModal,
}) => {
  const navigate = useNavigate();
  let otherUsers = users.filter((u) => u.id !== userId);

  const handleClick = async (uid) => {
    const userIds = [uid, userId];
    const chatId = await createChat(userIds);
    handleClose();
    navigate('/chats/' + chatId);
  };

  return (
    <>
      <section className="info">
        {chat.profileURL ? (
          <Avatar imageURL={chat.profileURL} size="large" />
        ) : (
          <GroupAvatar
            imageURLs={otherUsers.map((u) => u.profileURL)}
            size="large"
          />
        )}
        <h2>{chat.name || getChatName(otherUsers.map((u) => u.name))}</h2>
        <Button type="secondary" size="large" handleClick={openEditModal}>
          <Icon name="edit">Edit</Icon>
          Edit
        </Button>
      </section>

      <section className="members">
        <p>
          Members <span className="sml-txt grey">{users.length}</span>
        </p>
        {otherUsers.concat(users.find((u) => u.id === userId)).map((user) => (
          <ContactTab
            key={user.id}
            userId={user.id}
            disabled={user.id === userId}
            handleClick={user.id !== userId ? () => handleClick(user.id) : null}
          />
        ))}
        <Button type="secondary" size="large" handleClick={openManageModal}>
          Manage users
        </Button>
      </section>
    </>
  );
};

export default ChatInfo;
