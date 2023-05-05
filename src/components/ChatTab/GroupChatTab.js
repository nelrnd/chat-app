import GroupAvatar from '../GroupAvatar/GroupAvatar';
import UnreadLabel from './UnreadLabel';
import './ChatTab.css';
import { auth, db, getChatMembers, getOtherChatMembers } from '../../firebase';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getFormattedElapsedTime } from '../../utils';
import Icon from '../Icon/Icon';

const GroupChatTab = ({
  chatId,
  lastMessage,
  unreadCount,
  isActive,
  currentTime,
}) => {
  const [usersData, setUsersData] = useState();
  const navigate = useNavigate();

  const className = `ChatTab ${isActive ? 'active' : ''} ${
    unreadCount ? 'unread' : ''
  }`;

  const groupName = !!usersData && 'Group Name';

  useEffect(() => {
    const fetchUsersData = async () => {
      const members = await getChatMembers(chatId);
      const otherUids = getOtherChatMembers(members, auth.currentUser.uid);
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, where('id', 'in', otherUids));
      const snapshot = await getDocs(usersQuery);
      const usersData = [];
      snapshot.forEach((doc) => usersData.push(doc.data()));
      setUsersData(usersData);
    };
    fetchUsersData();
  }, [chatId]);

  const handleClick = () => navigate(`/chats/${chatId}`);

  const lastUserID =
    usersData && usersData.find((user) => user.id === lastMessage.from);
  const lastUserName = (lastUserID && lastUserID.name.split(' ')[0]) || 'You';

  if (usersData) {
    return (
      <div className={className} onClick={handleClick}>
        <GroupAvatar imageURLs={usersData.map((user) => user.profileURL)} />

        <div className="ChatTab_text col gap-2">
          <h3>{groupName}</h3>
          <div className="ChatTab_message">
            {`${lastUserName}: `}
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

export default GroupChatTab;
