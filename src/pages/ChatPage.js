import { useParams } from 'react-router-dom';
import { auth, db, readLastChatMessage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageHeader from '../components/PageHeader/PageHeader';
import ChatInput from '../components/ChatInput/ChatInput';
import useChatData from '../hooks/useChatData';
import Message from '../components/Message/Message';
import IconButton from '../components/IconButton/IconButton';
import ImageDisplay from '../components/ImageDisplay/ImageDisplay';
import { useEffect, useRef, useState } from 'react';
import withAuth from './withAuth';
import ContactInfo from '../components/ContactInfo/ContactInfo';
import GroupInfo from '../components/GroupInfo/GroupInfo';
import { getChatName, getFormattedDate } from '../utils';
import { collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import GroupMessage from '../components/Message/GroupMessage';
import ChatInfo from '../components/ChatInfo/ChatInfo';

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
  const usersQuery = chat && query(usersRef, where('id', 'in', chat.members));
  const [users] = useCollectionData(usersQuery);

  const [showImage, setShowImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const openImage = (url) => setShowImage(url);
  const closeImage = () => setShowImage(null);

  const openInfo = () => setShowInfo(true);
  const closeInfo = () => setShowInfo(false);

  const enteringChat = useRef(true);
  const bottomRef = useRef(null);

  const scrollToBottom = (type) => {
    bottomRef.current.scrollIntoView({ type });
  };

  useEffect(() => {
    enteringChat.current = true;
  }, [chatId]);

  useEffect(() => {
    if (!users || !messagesLength) return;
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

  return (
    <div className="chat-layout">
      <PageHeader>
        <h1>
          {chat.name ||
            (otherUsers.length === 1
              ? otherUsers[0].name
              : getChatName(otherUsers.map((u) => u.name)))}
        </h1>
        <IconButton name="info" handleClick={openInfo} />
      </PageHeader>

      <main>
        {chat.messages.map((msg, id) => {
          const followUp = checkFollowUp(msg, chat.messages[id + 1]);
          return users.length === 2 || msg.from === user.uid ? (
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

      <ChatInfo chat={chat} users={users} userId={user.uid} />
      <ImageDisplay imageURL={showImage} handleClose={closeImage} />
    </div>
  );
};

/*
const ChatPage = () => {
  const [user] = useAuthState(auth);
  const params = useParams();
  const chatId = params.chatId;
  const [chatData] = useChatData(chatId);
  const usersRef = collection(db, 'users');
  const usersQuery =
    chatData && query(usersRef, where('id', 'in', chatData.members));
  const [usersData] = useCollectionData(usersQuery);
  const otherUsers = usersData && usersData.filter((u) => u.id !== user.uid);
  const [messagesLength, setMessagesLength] = useState();
  //const [otherUserData] = useUserData(getOtherUserId(chatId));

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
    handleCloseInfo();
  }, [chatId]);

  // Handle bottom scroll
  useEffect(() => {
    if (!messagesLength || !usersData) return;
    if (enteringRoom.current === true) {
      scrollToBottom('instant');
      enteringRoom.current = false;
    } else {
      scrollToBottom('smooth');
    }
  }, [messagesLength, enteringRoom, usersData]);

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

  if (user && chatData) {
    return (
      <div className="chat-layout">
        <PageHeader>
          <h1>
            {usersData
              ? chatData.members.length === 2
                ? usersData[0].name
                : chatData.groupName ||
                  getChatName(otherUsers.map((user) => user.name))
              : null}
          </h1>
          <IconButton name="info" handleClick={handleOpenInfo} />
        </PageHeader>

        <main>
          {chatData.messages.map((msg, id) => {
            const followUp =
              chatData.messages[id + 1] &&
              chatData.messages[id + 1].from === msg.from &&
              getFormattedDate(chatData.messages[id + 1].date) ===
                getFormattedDate(msg.date);
            return chatData.members.length > 2 && msg.from !== user.uid ? (
              <GroupMessage
                key={msg.date}
                text={msg.text}
                imageURL={msg.imageURL}
                date={msg.date}
                from={msg.from}
                followUp={followUp}
                handleImageClick={handleOpenImage}
              />
            ) : (
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

        {usersData ? (
          chatData.members.length === 2 ? (
            <ContactInfo
              name={usersData && usersData[0].name}
              email={usersData && usersData[0].email}
              profileURL={usersData && usersData[0].profileURL}
              show={showInfo}
              handleClose={handleCloseInfo}
            />
          ) : (
            <GroupInfo
              groupName={
                chatData.groupName ||
                getChatName(usersData.map((user) => user.name))
              }
              imageURLs={usersData && usersData.map((user) => user.profileURL)}
              members={usersData}
              show={showInfo}
              handleClose={handleCloseInfo}
            />
          )
        ) : null}
        <ImageDisplay imageURL={showImageURL} handleClose={handleCloseImage} />
      </div>
    );
  }
};
*/

export default withAuth(ChatPage);
