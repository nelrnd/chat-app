import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db, getOtherUserId } from '../firebase';
import { Link } from 'react-router-dom';
import { getFormattedElapsedTime } from '../utils';
import Avatar from './Avatar';
import '../styles/ChatTab.css';

function ChatTab({ chatId, lastMessage, unreadCount, isActive, currentTime }) {
  const otherUid = getOtherUserId(chatId);
  const userRef = doc(db, 'users', otherUid);
  const [userData] = useDocumentData(userRef);

  const unreadValue = unreadCount[auth.currentUser.uid];

  const className = `ChatTab ${isActive ? 'active' : ''} ${
    unreadValue ? 'unread' : ''
  }`;

  if (userData) {
    return (
      <Link to={`/chats/${chatId}`} className="ChatTab_link">
        <div className={className}>
          <Avatar imageURL={userData.profileURL} />

          <div className="ChatTab_text">
            <h3 className="single-line">{userData.name}</h3>
            <p className="ChatTab_message-text single-line">
              {lastMessage.text}
            </p>
          </div>

          <div>
            {!!unreadValue && <UnreadLabel value={unreadValue} />}
            <p className="small grey">
              {getFormattedElapsedTime(lastMessage.date, currentTime)}
            </p>
          </div>
        </div>
      </Link>
    );
  }
}

function UnreadLabel({ value }) {
  return <div className="UnreadLabel">{value < 10 ? value : '9+'}</div>;
}

export default ChatTab;
