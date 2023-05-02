import { useEffect, useState } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ChatTab from './ChatTab';

function ChatTabs({ chatIds, currentChat }) {
  const chatsRef = collection(db, 'chats');
  const chatsQuery = query(chatsRef, where('id', 'in', chatIds));
  const [chats] = useCollectionData(chatsQuery);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  });

  if (chats) {
    return (
      <div>
        {chats
          .sort((a, b) => b.lastMessage.date - a.lastMessage.date)
          .map((chat) => (
            <ChatTab
              key={chat.id}
              chatId={chat.id}
              lastMessage={chat.lastMessage}
              unreadCount={chat.unreadCount}
              isActive={currentChat === chat.id}
              currentTime={currentTime}
            />
          ))}
      </div>
    );
  }
}

export default ChatTabs;
