import { Navigate, useParams } from 'react-router-dom';
import { auth, getOtherUserId, readLastChatMessage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageHeader from '../components/PageHeader/PageHeader';
import ChatInput from '../components/ChatInput/ChatInput';
import useChatData from '../hooks/useChatData';
import Message from '../components/Message/Message';
import IconButton from '../components/IconButton/IconButton';
import ImageDisplay from '../components/ImageDisplay/ImageDisplay';
import { useEffect, useRef, useState } from 'react';
import useUserData from '../hooks/useUserData';

const ChatPage = () => {
  const [user, loading] = useAuthState(auth);
  const params = useParams();
  const chatId = params.chatId;
  const [chatData] = useChatData(chatId);
  const [otherUserData] = useUserData(user && getOtherUserId(chatId, user.uid));
  const [messagesLength, setMessagesLength] = useState();

  const [showImageURL, setShowImageURL] = useState(null);

  const handleOpenImage = (url) => setShowImageURL(url);
  const handleCloseImage = () => setShowImageURL(null);

  const enteringRoom = useRef(true);
  const bottomRef = useRef(null);
  const scrollToBottom = (behavior) => {
    bottomRef.current.scrollIntoView({ behavior });
  };

  // Set enteringRoom to true when entering new chat
  useEffect(() => {
    enteringRoom.current = true;
  }, [chatId]);

  // Handle bottom scroll
  useEffect(() => {
    if (!messagesLength) return;
    if (enteringRoom.current === true) {
      scrollToBottom('instant');
      enteringRoom.current = false;
    } else {
      scrollToBottom('smooth');
    }
  }, [messagesLength, enteringRoom]);

  // Update messagesLength
  useEffect(() => {
    if (chatData && chatData.messages.length !== messagesLength) {
      setMessagesLength(chatData.messages.length);
    }
  }, [chatData, messagesLength]);

  // Mark last message as read
  useEffect(() => {
    (async () => await readLastChatMessage(chatId, auth.currentUser.uid))();
  }, [chatId, messagesLength]);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user && chatData && otherUserData) {
    return (
      <div className="chat-layout">
        <PageHeader>
          <h1>{otherUserData.name}</h1>
          <IconButton name="info" />
        </PageHeader>

        <main>
          {chatData.messages.map((msg) => (
            <Message
              key={msg.date}
              text={msg.text}
              imageURL={msg.imageURL}
              date={msg.date}
              isSent={msg.from === auth.currentUser.uid}
              handleImageClick={handleOpenImage}
            />
          ))}
          <div ref={bottomRef}></div>
        </main>

        <ChatInput chatId={chatId} isFirstMessage={messagesLength === 0} />

        <ImageDisplay imageURL={showImageURL} handleClose={handleCloseImage} />
      </div>
    );
  }
};

export default ChatPage;
