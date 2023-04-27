import { useRef, useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db, getOtherUserId, readLastChatMessage } from '../firebase';
import '../styles/ChatRoom.css';

import Message from './Message';
import ChatMessageInput from './ChatMessageInput';

function ChatRoom({ chatId }) {
  const enteringRoom = useRef(true);
  const bottomRef = useRef();

  const otherUid = getOtherUserId(chatId);
  const [otherUserData] = useDocumentData(doc(db, 'users', otherUid));
  const [chatData] = useDocumentData(doc(db, 'chats', chatId));
  const [messagesLength, setMessagesLength] = useState();

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

  useEffect(() => {
    if (chatData && chatData.messages.length !== messagesLength) {
      setMessagesLength(chatData.messages.length);
    }
  }, [chatData, messagesLength]);

  useEffect(() => {
    (async () => {
      await readLastChatMessage(chatId, auth.currentUser.uid);
    })();
  }, [chatId, messagesLength]);

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

      <ChatMessageInput chatId={chatId} isFirstMessage={messagesLength === 0} />
    </div>
  );
}

export default ChatRoom;
