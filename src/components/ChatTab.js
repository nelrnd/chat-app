import Avatar from './Avatar';

import '../styles/ChatTab.css';

function ChatTab({
  name,
  lastMessage,
  imageUrl,
  unreadMessages,
  isActive,
  handleClick,
}) {
  return (
    <div
      className={'ChatTab' + (isActive ? ' active' : '')}
      onClick={handleClick}
    >
      <Avatar imageUrl={imageUrl} />

      <div>
        <h3>{name}</h3>
        <p className={unreadMessages ? 'bold' : 'grey'}>{lastMessage.text}</p>
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
