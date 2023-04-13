import Avatar from './Avatar';

import '../styles/ChatTab.css';

function ChatTab({ name, lastMessage, imageUrl, unreadMessages }) {
  return (
    <div className="ChatTab">
      <Avatar imageUrl={imageUrl} />

      <div>
        <h3>{name}</h3>
        <p>{lastMessage.text}</p>
      </div>

      <div>
        {unreadMessages && (
          <div className="ChatTab_unread-label">{unreadMessages.length}</div>
        )}
        <div>{lastMessage.date}</div>
      </div>
    </div>
  );
}

export default ChatTab;
