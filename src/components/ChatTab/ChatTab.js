import { useNavigate } from 'react-router-dom';
import { getOtherUserId } from '../../firebase';
import useUserData from '../../hooks/useUserData';
import { getFormattedElapsedTime } from '../../utils';
import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import './ChatTab.css';

const ChatTab = ({
  chatId,
  lastMessage,
  unreadCount,
  isActive,
  currentTime,
}) => {
  const otherUid = getOtherUserId(chatId);
  const [userData] = useUserData(otherUid);
  const navigate = useNavigate();

  const className = `ChatTab ${isActive ? 'active' : ''} ${
    unreadCount ? 'unread' : ''
  }`;

  const handleClick = () => navigate(`/chats/${chatId}`);

  if (userData) {
    return (
      <div className={className} onClick={handleClick}>
        <Avatar imageURL={userData.profileURL} />

        <div className="ChatTab_text col gap-2">
          <h3>{userData.name}</h3>
          <div className="ChatTab_message">
            {lastMessage.imageURL && <Icon name="image" />}
            {lastMessage.imageURL && !lastMessage.text && 'image'}
            {lastMessage.text}
          </div>
        </div>

        <div>
          {!!unreadCount && <UnreadLabel count={unreadCount} />}
          <div className={`sml-txt ${unreadCount ? '' : 'grey'}`}>
            {getFormattedElapsedTime(lastMessage.date, currentTime)}
          </div>
        </div>
      </div>
    );
  }
};

const UnreadLabel = ({ count }) => {
  return <div className="UnreadLabel">{count < 10 ? count : '9+'}</div>;
};

export default ChatTab;
