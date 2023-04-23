import { useState, useEffect } from 'react';
import ChatTab from './ChatTab';

function ChatTabs({ chats, currentChat }) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // keep updated elapsed time since last message
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div className="ChatTabs">
      {chats &&
        chats
          .sort((a, b) => b.lastMessage.date - a.lastMessage.date)
          .map((chat) => (
            <ChatTab
              key={chat.id}
              name={chat.name}
              profileURL={chat.profileURL}
              lastMessage={chat.lastMessage}
              isActive={currentChat === chat.id}
              currentTime={currentTime}
              chatId={chat.id}
            />
          ))}
    </div>
  );
}

export default ChatTabs;
