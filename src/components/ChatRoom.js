import { useRef, useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {
  auth,
  createChatMessage,
  db,
  getOtherUserId,
  updateLastChatMessage,
} from '../firebase';
import '../styles/ChatRoom.css';

import Message from './Message';
import { createChatRefs } from '../firebase';

function ChatRoom({ chatId }) {
  const [messageInput, setMessageInput] = useState('');
  const enteringRoom = useRef(true);
  const bottomRef = useRef();

  const otherUid = getOtherUserId(chatId);
  const [otherUserData] = useDocumentData(doc(db, 'users', otherUid));
  const [chatData] = useDocumentData(doc(db, 'chats', chatId));

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const messageInputCopy = messageInput.trim();
    setMessageInput('');
    if (chatData.messages.length === 0) {
      const userIds = [auth.currentUser.uid, otherUid];
      createChatRefs(userIds, chatId);
    }
    const message = await createChatMessage(chatId, messageInputCopy);
    updateLastChatMessage(chatId, message);
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
  }, [chatId]);

  return (
    <div className="ChatRoom">
      <header className="page-bar">
        <h2 className="large single-line">
          {otherUserData && otherUserData.name}
        </h2>
      </header>

      <section className="messages">
        {chatData &&
          chatData.messages &&
          chatData.messages.map((msg) => (
            <Message
              key={msg.date + msg.from}
              text={msg.text}
              date={msg.date}
              isSent={msg.from === auth.currentUser.uid}
            />
          ))}

        <div ref={bottomRef}></div>
      </section>

      <section className="page-bar bottom">
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
