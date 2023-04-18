import Avatar from './Avatar';

import '../styles/ChatTab.css';

function ChatTab({ name, profileURL, lastMessage, isActive, handleClick }) {
  return (
    <div
      className={`ChatTab ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <Avatar imageURL={profileURL} />

      <div>
        <h3>{name}</h3>
        <p>{lastMessage.text}</p>
      </div>

      <div>
        <p className="small grey">{lastMessage.date}</p>
      </div>
    </div>
  );
}

function UnreadLabel({ value }) {
  return <div className="UnreadLabel">{value < 10 ? value : '9+'}</div>;
}

export default ChatTab;
