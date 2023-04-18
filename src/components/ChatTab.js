import Avatar from './Avatar';
import { getFormattedElapsedTime } from '../utils';

import '../styles/ChatTab.css';

function ChatTab({
  name,
  profileURL,
  lastMessage,
  isActive,
  currentTime,
  handleClick,
}) {
  return (
    <div
      className={`ChatTab ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <Avatar imageURL={profileURL} />

      <div className="text">
        <h3 className="single-line">{name}</h3>
        <p className="single-line">{lastMessage.text}</p>
      </div>

      <div>
        <p className="small grey">
          {getFormattedElapsedTime(lastMessage.date, currentTime)}
        </p>
      </div>
    </div>
  );
}

function UnreadLabel({ value }) {
  return <div className="UnreadLabel">{value < 10 ? value : '9+'}</div>;
}

export default ChatTab;
