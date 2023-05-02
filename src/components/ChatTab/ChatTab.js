import Avatar from '../Avatar/Avatar';
import './ChatTab.css';

const ChatTab = ({ profileURL, name, lastMessage }) => {
  return (
    <div className="ChatTab">
      <Avatar imageURL={profileURL} />

      <div className="col gap-2">
        <h3>{name}</h3>
        <p>{lastMessage.text}</p>
      </div>

      <div>
        <div className="sml-txt grey">{lastMessage.date}</div>
      </div>
    </div>
  );
};

export default ChatTab;
