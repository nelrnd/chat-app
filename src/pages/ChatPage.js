import { Navigate, useParams } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageHeader from '../components/PageHeader/PageHeader';
import ChatInput from '../components/ChatInput/ChatInput';
import useChatData from '../hooks/useChatData';
import Message from '../components/Message/Message';
import IconButton from '../components/IconButton/IconButton';
import ImageDisplay from '../components/ImageDisplay/ImageDisplay';
import { useState } from 'react';

const ChatPage = () => {
  const [user, loading] = useAuthState(auth);
  const params = useParams();
  const chatId = params.chatId;
  const [chatData] = useChatData(chatId);

  const [showImageURL, setShowImageURL] = useState(null);

  const handleOpenImage = (url) => setShowImageURL(url);
  const handleCloseImage = () => setShowImageURL(null);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user && chatData) {
    return (
      <div className="chat-layout">
        <PageHeader>
          <h1>Chat page</h1>
          <IconButton name="info" />
        </PageHeader>

        <main>
          {chatData.messages.map((msg) => (
            <Message
              key={msg.date}
              text={msg.text}
              imageURL={msg.imageURL}
              isSent={msg.from === auth.currentUser.uid}
              handleImageClick={handleOpenImage}
            />
          ))}
        </main>

        <ChatInput
          chatId={chatId}
          isFirstMessage={chatData.messages.length === 0}
        />

        <ImageDisplay imageURL={showImageURL} handleClose={handleCloseImage} />
      </div>
    );
  }
};

export default ChatPage;
