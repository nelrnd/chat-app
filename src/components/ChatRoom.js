import { useState } from 'react';
import { doc } from 'firebase/firestore';
import {
  addChatMessage,
  auth,
  createChatRefForUsers,
  db,
  updateLastMessage,
} from '../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getUsersId } from '../utils';
import '../styles/ChatRoom.css';

import Message from './Message';

function ChatRoom({ currentChat }) {
  const chatRef = doc(db, 'chats', currentChat);
  const [chat] = useDocumentData(chatRef);

  const uid = getUsersId(currentChat).find((i) => i !== auth.currentUser.uid);
  const userRef = doc(db, 'users', uid);
  const [user] = useDocumentData(userRef);

  const [messageInput, setMessageInput] = useState('');

  const handleMessageInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!messageInput) return;

    // If this is the first messsage being sent
    if (!chat.messages.length) {
      // Create a reference to the chat doc for each users
      createChatRefForUsers([uid, auth.currentUser.uid]);
    }

    const message = await addChatMessage(currentChat, messageInput);
    updateLastMessage(currentChat, message);

    setMessageInput('');
  };

  return (
    <div className="ChatRoom">
      <header>
        <h2 className="large single-line">{user && user.name}</h2>
      </header>

      <section className="messages">
        {chat &&
          chat.messages.map((msg) => (
            <Message
              key={msg.date + msg.from}
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
