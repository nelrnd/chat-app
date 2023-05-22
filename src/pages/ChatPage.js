import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { auth, readLastChatMessage } from '../firebase';
import { getChatName, getFormattedDate } from '../utils';
import useMembersData from '../hooks/useMembersData';
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
import ChatAction from '../components/ChatAction/ChatAction';

// Check if a message is followed by another of same user and date
const checkFollowUp = (msg1, msg2) => {
  return (
    msg2 &&
    msg1.from === msg2.from &&
    getFormattedDate(msg1.date) === getFormattedDate(msg2.date)
  );
};

// ChatPagePre allows ChatPage to get chat data from the start
const ChatPagePre = () => {
  // get chat data
  const params = useParams();
  const chatId = params.chatId;
  const [user, userLoading] = useAuthState(auth);
  const [chat, chatLoading] = useChatData(chatId);

  if (userLoading || chatLoading) return <p>Loading...</p>;

  return chat && chat.members.some((u) => u.id === user.uid && !u.left) ? (
    <ChatPage chat={chat} user={user} />
  ) : (
    <Navigate to="/" replace />
  );
};

const ChatPage = ({ chat, user }) => {
  const [members] = useMembersData(chat.members.map((m) => m.id));

  const navigate = useNavigate();

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

  const scrollToBottom = (type) => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ block: 'end', behavior: type });
      }
    }, 100);
  };

  const enteringChat = useRef(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (enteringChat.current === true) {
      scrollToBottom('instant');
      enteringChat.current = false;
    } else {
      scrollToBottom('smooth');
    }
  }, [chat.id, chat.messages, chat.actions]);

  useEffect(() => {
    (async () => {
      await readLastChatMessage(chat.id, user.uid);
    })();
  }, [chat.id, chat.messages, user.uid]);

  if (!user || !members || members.length !== chat.members.length) return null;

  const otherUsers = members.filter((u) => u.id !== user.uid);

  // Chat members that are not current user and that are not left
  const otherMembers = members.filter(
    (m) => m.id !== user.uid && !chat.members.find((u) => u.id === m.id).left
  );

  let messagesAndActions = chat.messages
    .map((msg) => ({ ...msg, type: 'message' }))
    .concat(chat.actions || [])
    .sort((a, b) => a.date - b.date);

  if (chat.type === 'private' && !otherMembers.length) return null;

  return (
    <div className="chat-layout">
      <PageHeader>
        <IconButton
          name="back"
          handleClick={() => navigate('/')}
          hideOnBig={true}
        />

        <h1>{chat.name || getChatName(otherMembers.map((u) => u.name))}</h1>

        <IconButton name="info" handleClick={openInfo} />
      </PageHeader>

      <main>
        {messagesAndActions.map((item, id) => {
          if (item.type === 'message') {
            const props = {
              text: item.text,
              imageURL: item.imageURL,
              date: item.date,
              followUp: checkFollowUp(item, messagesAndActions[id + 1]),
              handleImageClick: openImage,
            };

            return chat.type === 'private' || item.from === user.uid ? (
              <Message
                key={item.date + id}
                isSent={item.from === user.uid}
                {...props}
              />
            ) : (
              <GroupMessage
                key={item.date + id}
                user={members.find((m) => m.id === item.from)}
                {...props}
              />
            );
          } else {
            const names = item.users.map(
              (u) => members.find((m) => m.id === u).name
            );
            return (
              <ChatAction key={item.date + id} type={item.type} names={names} />
            );
          }
        })}

        <div ref={bottomRef} />
      </main>

      <ChatInput chatId={chat.id} isFirstMessage={!chat.messages.length} />

      <ChatInfo
        chat={chat}
        users={members.filter(
          (m) => !chat.members.find((u) => u.id === m.id).left
        )}
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
            users={members.filter(
              (m) => !chat.members.find((u) => u.id === m.id).left
            )}
            userId={user.uid}
            chatId={chat.id}
            show={showManageModal}
            handleClose={closeManageModal}
          />
        </>
      )}
    </div>
  );
};

export default withAuth(ChatPagePre);
