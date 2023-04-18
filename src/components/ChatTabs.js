import { useState, useEffect } from 'react';
import ChatTab from './ChatTab';

function ChatTabs({ chats, currentChat, handleChatTabClick }) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div className="ChatTabs">
      {chats &&
        chats.map((chat) => (
          <ChatTab
            key={chat.id}
            name={chat.name}
            profileURL={chat.profileURL}
            lastMessage={chat.lastMessage}
            isActive={currentChat === chat.id}
            currentTime={currentTime}
            handleClick={() => handleChatTabClick(chat.id)}
          />
        ))}
    </div>
  );
}

export default ChatTabs;
