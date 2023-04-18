import { useRef, useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {
  addChatMessage,
  auth,
  createChatRefForUsers,
  db,
  getOtherUserId,
  updateLastMessage,
} from '../firebase';
import '../styles/ChatRoom.css';

import Message from './Message';

function ChatRoom({ currentChat }) {
  const [messageInput, setMessageInput] = useState('');
  const enteringRoom = useRef(true);
  const bottomRef = useRef();

  const otherUid = getOtherUserId(currentChat);
  const [otherUserData] = useDocumentData(doc(db, 'users', otherUid));
  const [chatData] = useDocumentData(doc(db, 'chats', currentChat));

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!messageInput) return;
    if (chatData.messages.length === 0) {
      createChatRefForUsers([otherUid, auth.currentUser.uid]);
    }
    const message = await addChatMessage(currentChat, messageInput);
    updateLastMessage(currentChat, message);
    setMessageInput('');
  };

  const scrollToBottom = (behavior) => {
    bottomRef.current.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (chatData) {
      if (enteringRoom.current) {
        scrollToBottom('instant');
        enteringRoom.current = false;
      } else {
        scrollToBottom('smooth');
      }
    }
  }, [chatData, enteringRoom]);

  useEffect(() => {
    enteringRoom.current = true;
  }, [currentChat]);

  return (
    <div className="ChatRoom">
      <header>
        <h2 className="large single-line">
          {otherUserData && otherUserData.name}
        </h2>
      </header>

      <section className="messages">
        {chatData &&
          chatData.messages.map((msg) => (
            <Message
              key={msg.date + msg.from}
              content={msg.content}
              date={msg.date}
              isSent={msg.from === auth.currentUser.uid}
            />
          ))}
        <div ref={bottomRef}></div>
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
