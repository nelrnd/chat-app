import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db, getOtherUserId } from '../firebase';
import { Link } from 'react-router-dom';
import { getFormattedElapsedTime } from '../utils';
import Avatar from './Avatar';
import '../styles/ChatTab.css';

function ChatTab({ chatId, lastMessage, isActive, currentTime }) {
  const otherUid = getOtherUserId(chatId);
  const userRef = doc(db, 'users', otherUid);
  const [userData] = useDocumentData(userRef);

  if (userData) {
    return (
      <Link to={`/chats/${chatId}`} className="ChatTab_link">
        <div className={`ChatTab ${isActive ? 'active' : ''}`}>
          <Avatar imageURL={userData.profileURL} />

          <div className="ChatTab_text">
            <h3 className="single-line">{userData.name}</h3>
            <p className="single-line">{lastMessage.text}</p>
          </div>

          <div>
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
