import { useParams } from 'react-router-dom';
import { auth, getOtherUserId, readLastChatMessage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageHeader from '../components/PageHeader/PageHeader';
import ChatInput from '../components/ChatInput/ChatInput';
import useChatData from '../hooks/useChatData';
import Message from '../components/Message/Message';
import IconButton from '../components/IconButton/IconButton';
import ImageDisplay from '../components/ImageDisplay/ImageDisplay';
import { useEffect, useRef, useState } from 'react';
import withAuth from './withAuth';
import useUserData from '../hooks/useUserData';
import ContactInfo from '../components/ContactInfo/ContactInfo';
import { getFormattedDate } from '../utils';

const ChatPage = () => {
  const [user] = useAuthState(auth);
  const params = useParams();
  const chatId = params.chatId;
  const [chatData] = useChatData(chatId);
  const [messagesLength, setMessagesLength] = useState();
  const [otherUserData] = useUserData(getOtherUserId(chatId));

  const [showImageURL, setShowImageURL] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleOpenImage = (url) => setShowImageURL(url);
  const handleCloseImage = () => setShowImageURL(null);

  const handleOpenInfo = () => setShowInfo(true);
  const handleCloseInfo = () => setShowInfo(false);

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

  if (user && chatData && otherUserData) {
    return (
      <div className="chat-layout">
        <PageHeader>
          <h1>{otherUserData.name}</h1>
          <IconButton name="info" handleClick={handleOpenInfo} />
        </PageHeader>

        <main>
          {chatData.messages.map((msg, id) => {
            const followUp =
              chatData.messages[id + 1] &&
              chatData.messages[id + 1].from === msg.from &&
              getFormattedDate(chatData.messages[id + 1].date) ===
                getFormattedDate(msg.date);
            return (
              <Message
                key={msg.date}
                text={msg.text}
                imageURL={msg.imageURL}
                date={msg.date}
                isSent={msg.from === auth.currentUser.uid}
                followUp={followUp}
                handleImageClick={handleOpenImage}
              />
            );
          })}
          <div ref={bottomRef}></div>
        </main>

        <ChatInput chatId={chatId} isFirstMessage={messagesLength === 0} />

        <ContactInfo
          name={otherUserData.name}
          email={otherUserData.email}
          profileURL={otherUserData.profileURL}
          show={showInfo}
          handleClose={handleCloseInfo}
        />
        <ImageDisplay imageURL={showImageURL} handleClose={handleCloseImage} />
      </div>
    );
  }
};

export default withAuth(ChatPage);
