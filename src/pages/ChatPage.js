import { useEffect, useRef, useState } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useParams } from 'react-router-dom';
import { auth, db, readLastChatMessage } from '../firebase';
import { getChatName, getFormattedDate } from '../utils';
import PageHeader from '../components/PageHeader/PageHeader';
import ChatInput from '../components/ChatInput/ChatInput';
import useChatData from '../hooks/useChatData';
import Message from '../components/Message/Message';
import IconButton from '../components/IconButton/IconButton';
import ImageDisplay from '../components/ImageDisplay/ImageDisplay';
import withAuth from './withAuth';
import GroupMessage from '../components/Message/GroupMessage';
import ChatInfo from '../components/ChatInfo/ChatInfo';
import EditGroupModal from '../components/Modals/EditGroupModal';
import ManageUsersModal from '../components/Modals/ManageUsersModal';

// Check if a message is followed by another of same user and date
const checkFollowUp = (msg1, msg2) => {
  if (!msg2) return false;
  return (
    msg1.from === msg2.from &&
    getFormattedDate(msg1.date) === getFormattedDate(msg2.date)
  );
};

const ChatPage = () => {
  // get user info
  const [user] = useAuthState(auth);
  // get chat data
  const params = useParams();
  const chatId = params.chatId;
  const [chat] = useChatData(chatId);
  const [messagesLength, setMessagesLength] = useState(0);
  // get chat members info
  const usersRef = collection(db, 'users');
  const userIds = chat && chat.members.filter((u) => !u.left).map((u) => u.id);
  const usersQuery = userIds && query(usersRef, where('id', 'in', userIds));
  const [users] = useCollectionData(usersQuery);

  const [showImage, setShowImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const openImage = (url) => setShowImage(url);
  const closeImage = () => setShowImage(null);

  const openInfo = () => setShowInfo(true);
  const closeInfo = () => setShowInfo(false);

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openManageModal = () => setShowManageModal(true);
  const closeManageModal = () => setShowManageModal(false);

  const enteringChat = useRef(true);
  const bottomRef = useRef(null);

  const scrollToBottom = (type) => {
    bottomRef.current.scrollIntoView({ type });
  };

  useEffect(() => {
    enteringChat.current = true;
  }, [chatId]);

  useEffect(() => {
    if (!users || !messagesLength || !bottomRef.current) return;
    if (enteringChat.current) {
      scrollToBottom('instant');
      enteringChat.current = false;
    } else {
      scrollToBottom('smooth');
    }
  }, [users, messagesLength, enteringChat]);

  useEffect(() => {
    if (!chat) return;
    if (chat.messages.length !== messagesLength) {
      setMessagesLength(chat.messages.length);
    }
  }, [chat, messagesLength]);

  useEffect(() => {
    const readLast = async () => {
      await readLastChatMessage(chatId, user.uid);
    };
    readLast();
  }, [chatId, user.uid, messagesLength]);

  if (!user || !chat || !users) return null;

  const otherUsers = users.filter((u) => u.id !== user.uid);

  if (
    !chat.members.find((u) => u.id === user.uid) ||
    chat.members.find((u) => u.id === user.uid).left
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="chat-layout">
      <PageHeader>
        <h1>
          {chat.name ||
            (chat.type === 'private'
              ? otherUsers[0].name
              : getChatName(otherUsers.map((u) => u.name)))}
        </h1>
        <IconButton name="info" handleClick={openInfo} />
      </PageHeader>

      <main>
        {chat.messages.map((msg, id) => {
          const followUp = checkFollowUp(msg, chat.messages[id + 1]);
          return chat.type === 'private' || msg.from === user.uid ? (
            <Message
              key={msg.date}
              text={msg.text}
              imageURL={msg.imageURL}
              date={msg.date}
              isSent={msg.from === user.uid}
              followUp={followUp}
              handleImageClick={openImage}
            />
          ) : (
            <GroupMessage
              key={msg.date}
              text={msg.text}
              imageURL={msg.imageURL}
              date={msg.date}
              user={users.find((u) => u.id === msg.from)}
              followUp={followUp}
              handleImageClick={openImage}
            />
          );
        })}

        <div ref={bottomRef} />
      </main>

      <ChatInput chatId={chatId} isFirstMessage={!messagesLength} />

      <ChatInfo
        chat={chat}
        users={users}
        userId={user.uid}
        show={showInfo}
        handleClose={closeInfo}
        openEditModal={openEditModal}
        openManageModal={openManageModal}
      />
      <ImageDisplay imageURL={showImage} handleClose={closeImage} />

      {chat.type === 'group' && (
        <>
          <EditGroupModal
            chat={chat}
            userProfiles={otherUsers.map((user) => user.profileURL)}
            show={showEditModal}
            handleClose={closeEditModal}
          />
          <ManageUsersModal
            users={users}
            userId={user.uid}
            chatId={chatId}
            show={showManageModal}
            handleClose={closeManageModal}
          />
        </>
      )}
    </div>
  );
};

export default withAuth(ChatPage);
