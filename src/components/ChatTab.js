import Avatar from './Avatar';

import '../styles/ChatTab.css';

function ChatTab({ name, lastMessage, imageUrl, unreadMessages }) {
  return (
    <div className="ChatTab">
      <Avatar imageUrl={imageUrl} />

      <div>
        <h3>{name}</h3>
        <p className="grey">{lastMessage.text}</p>
      </div>

      <div className="small">
        {unreadMessages && (
          <div className="ChatTab_unread-label">
            {unreadMessages.length < 10 ? unreadMessages.length : '9+'}
          </div>
        )}
        <div className="grey">{lastMessage.date}</div>
      </div>
    </div>
  );
}

export default ChatTab;
