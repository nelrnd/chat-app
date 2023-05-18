import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../firebase';
import { getChatName, getFormattedElapsedTime } from '../../utils';
import useUserData from '../../hooks/useUserData';
import Avatar from '../Avatar/Avatar';
import GroupAvatar from '../GroupAvatar/GroupAvatar';
import Icon from '../Icon/Icon';
import './ChatTab.css';

const filterNotCurrentUser = (user) => user.id !== auth.currentUser.uid;

const getUserUnreadCount = (unreadCount) => unreadCount[auth.currentUser.uid];

const ChatTab = ({ chat, isActive }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate('/chats/' + chat.id);

  if (!chat.lastMessage.from) return null;

  return chat.type === 'private' ? (
    <PrivateChatTab chat={chat} isActive={isActive} handleClick={handleClick} />
  ) : (
    <GroupChatTab chat={chat} isActive={isActive} handleClick={handleClick} />
  );
};

const PrivateChatTab = ({ chat, isActive, handleClick }) => {
  const { lastMessage } = chat;
  const unreadCount = getUserUnreadCount(chat.unreadCount);
  const otherUserId = chat.members.filter(filterNotCurrentUser)[0].id;
  const [otherUser] = useUserData(otherUserId);

  const [currentTime, setCurrentTime] = useState(Date.now());

  const className = `ChatTab ${isActive ? 'active' : ''} ${
    unreadCount ? 'unread' : ''
  }`;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now), 10000);
    return () => clearInterval(timer);
  }, [chat]);

  if (!otherUser) return null;

  return (
    <div className={className} onClick={handleClick}>
      <Avatar imageURL={otherUser.profileURL} />

      <div>
        <h3>{otherUser.name}</h3>
        <div className="message">
          {lastMessage.imageURL && <Icon name="image" />}
          {lastMessage.imageURL && !lastMessage.text && 'image'}
          {lastMessage.text}
        </div>
      </div>

      <div>
        {unreadCount > 0 && <UnreadLabel count={unreadCount} />}

        <p className="date">
          {getFormattedElapsedTime(lastMessage.date, currentTime)}
        </p>
      </div>
    </div>
  );
};

const GroupChatTab = ({ chat, isActive, handleClick }) => {
  const { lastMessage } = chat;
  const unreadCount = getUserUnreadCount(chat.unreadCount);
  const usersCollection = collection(db, 'users');
  const userIds = chat.members.filter((u) => !u.left).map((u) => u.id);
  const usersQuery = query(usersCollection, where('id', 'in', userIds));
  const [users] = useCollectionData(usersQuery);

  const [lastUser] = useUserData(chat.lastMessage.from);

  const [currentTime, setCurrentTime] = useState(Date.now());

  const className = `ChatTab ${isActive ? 'active' : ''} ${
    unreadCount ? 'unread' : ''
  }`;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now), 10000);
    return () => clearInterval(timer);
  }, [chat]);

  if (!users || !lastUser) return null;

  const otherUsers = users.filter(filterNotCurrentUser);

  return (
    <div className={className} onClick={handleClick}>
      {chat.profileURL ? (
        <Avatar imageURL={chat.profileURL} />
      ) : otherUsers.length ? (
        <GroupAvatar
          imageURLs={otherUsers.slice(-4).map((user) => user.profileURL)}
        />
      ) : (
        <Avatar imageURL={auth.currentUser.photoURL} />
      )}

      <div>
        <h3>{chat.name || getChatName(otherUsers.map((user) => user.name))}</h3>
        <div className="message">
          {lastMessage.from === auth.currentUser.uid
            ? 'You: '
            : lastUser && lastUser.name.split(' ')[0] + ': '}
          {lastMessage.imageURL && <Icon name="image" />}
          {lastMessage.imageURL && !lastMessage.text && 'image'}
          {lastMessage.text}
        </div>
      </div>

      <div>
        {unreadCount > 0 && <UnreadLabel count={unreadCount} />}

        <p className="date">
          {getFormattedElapsedTime(lastMessage.date, currentTime)}
        </p>
      </div>
    </div>
  );
};

const UnreadLabel = ({ count }) => {
  return <div className="UnreadLabel">{count < 10 ? count : '9+'}</div>;
};

export default ChatTab;
