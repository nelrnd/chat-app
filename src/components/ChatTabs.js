import ChatTab from './ChatTab';

function ChatTabs({ chats, currentChat, handleChatTabClick }) {
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
            handleClick={() => handleChatTabClick(chat.id)}
          />
        ))}
    </div>
  );
}

export default ChatTabs;
