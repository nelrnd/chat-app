import { useNavigate } from 'react-router-dom';
import { getOtherUserId } from '../../firebase';
import useUserData from '../../hooks/useUserData';
import { getFormattedElapsedTime } from '../../utils';
import Avatar from '../Avatar/Avatar';
import './ChatTab.css';

const ChatTab = ({ chatId, lastMessage }) => {
  const otherUid = getOtherUserId(chatId);
  const [userData] = useUserData(otherUid);
  const navigate = useNavigate();

  const handleClick = () => navigate(`/chats/${chatId}`);

  if (userData) {
    return (
      <div className="ChatTab" onClick={handleClick}>
        <Avatar imageURL={userData.profileURL} />

        <div className="col gap-2">
          <h3>{userData.name}</h3>
          <p>{lastMessage.text}</p>
        </div>

        <div>
          <div className="sml-txt grey">
            {getFormattedElapsedTime(lastMessage.date, Date.now())}
          </div>
        </div>
      </div>
    );
  }
};

export default ChatTab;
