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

const filterNotCurrentUser = (id) => id !== auth.currentUser.uid;

const getUserUnreadCount = (unreadCount) => unreadCount[auth.currentUser.uid];

const ChatTab = ({ chat, isActive }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate('/chats/' + chat.id);

  return chat.members.length <= 2 ? (
    <PrivateChatTab chat={chat} isActive={isActive} handleClick={handleClick} />
  ) : (
    <GroupChatTab chat={chat} isActive={isActive} handleClick={handleClick} />
  );
};

const PrivateChatTab = ({ chat, isActive, handleClick }) => {
  const { lastMessage } = chat;
  const unreadCount = getUserUnreadCount(chat.unreadCount);
  const otherUserId = chat.members.filter(filterNotCurrentUser)[0];
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

  const otherUserIds = chat.members.filter(filterNotCurrentUser);
  const usersCollection = collection(db, 'users');
  const usersQuery = query(usersCollection, where('id', 'in', otherUserIds));
  const [otherUsers] = useCollectionData(usersQuery);

  const [currentTime, setCurrentTime] = useState(Date.now());

  const className = `ChatTab ${isActive ? 'active' : ''} ${
    unreadCount ? 'unread' : ''
  }`;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now), 10000);
    return () => clearInterval(timer);
  }, [chat]);

  if (!otherUsers) return null;

  return (
    <div className={className} onClick={handleClick}>
      <GroupAvatar
        imageURLs={otherUsers.slice(-4).map((user) => user.profileURL)}
      />

      <div>
        <h3>{chat.name || getChatName(otherUsers.map((user) => user.name))}</h3>
        <div className="message">
          {(otherUsers.map((user) => user.id).includes(lastMessage.from)
            ? otherUsers
                .find((user) => user.id === lastMessage.from)
                .name.split(' ')[0]
            : 'You') + ': '}
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
