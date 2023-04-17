import { useState } from 'react';
import { doc } from 'firebase/firestore';
import { addChatMessage, auth, db } from '../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import '../styles/ChatRoom.css';

import Message from './Message';

function ChatRoom({ currentChat }) {
  const chatRef = doc(db, 'chats', currentChat);
  const [chat] = useDocumentData(chatRef);

  const uid = currentChat.split('-').find((i) => i !== auth.currentUser.uid);
  const userRef = doc(db, 'users', uid);
  const [user] = useDocumentData(userRef);

  const [messageInput, setMessageInput] = useState('');

  const handleMessageInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!messageInput) return;
    addChatMessage(currentChat, messageInput);
    setMessageInput('');
  };

  return (
    <div className="ChatRoom">
      <header>
        <h2 className="large">{user && user.displayName}</h2>
      </header>

      <section className="messages">
        {chat &&
          chat.messages.map((msg) => (
            <Message
              content={msg.content}
              date={msg.date}
              isSent={msg.from === auth.currentUser.uid}
            />
          ))}
      </section>

      <section className="bottom">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Type in something..."
            className="filled"
            value={messageInput}
            onChange={handleMessageInputChange}
          />
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}

export default ChatRoom;
