import { useState } from 'react';
import ChatTab from './ChatTab';

const chats = [
  {
    id: 0,
    name: 'Aubrey',
    lastMessage: { text: "I'll be there in 2 mins", date: '2m' },
    imageUrl:
      'https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg',
    unreadMessages: null,
  },
  {
    id: 1,
    name: 'Victoria',
    lastMessage: { text: 'Perfect!', date: '16m' },
    imageUrl:
      'https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg',
    unreadMessages: ['a', 'b', 'c'],
  },
  {
    id: 2,
    name: 'Philip',
    lastMessage: { text: 'just ideas for next time', date: '2h' },
    imageUrl:
      'https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg',
    unreadMessages: null,
  },
  {
    id: 3,
    name: 'Ronad',
    lastMessage: { text: "Haha that's terrifying 😂", date: '7d' },
    imageUrl:
      'https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg',
    unreadMessages: null,
  },
];

function ChatTabs() {
  const [currentTab, setCurrentTab] = useState(null);

  const handleTabClick = (id) => setCurrentTab(id);

  return (
    <div className="ChatTabs">
      {chats.map((chat) => (
        <ChatTab
          key={chat.id}
          name={chat.name}
          lastMessage={chat.lastMessage}
          imageUrl={chat.imageUrl}
          unreadMessages={chat.unreadMessages}
          isActive={currentTab === chat.id}
          handleClick={() => handleTabClick(chat.id)}
        />
      ))}
    </div>
  );
}

export default ChatTabs;
