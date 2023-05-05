import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import IconButton from '../IconButton/IconButton';
import TextInput from '../TextInput/TextInput';
import './Sidebar.css';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { collection, doc, query, where } from 'firebase/firestore';
import { db, auth, createChat, getOtherUserId } from '../../firebase';
import ChatTab from '../ChatTab/ChatTab';
import ContactTab from '../ContactTab/ContactTab';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import ContactTag from '../ContactTag/ContactTag';
import GroupChatTab from '../ChatTab/GroupChatTab';

const filterUsers = (users, searchTerm) => {
  return users
    .filter((user) => user.id !== auth.currentUser.uid)
    .filter((user) => user.email.toLowerCase() === searchTerm.toLowerCase());
};

const Sidebar = () => {
  const params = useParams();
  const chatId = params.chatId;
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const [userData] = useDocumentData(userRef);
  const chatsRef = collection(db, 'chats');
  const chatsQuery =
    userData &&
    !!userData.chats.length &&
    query(chatsRef, where('id', 'in', userData.chats));
  const [chats] = useCollectionData(chatsQuery);
  const [searchTerm, setSearchTerm] = useState('');
  const allUsersRef = collection(db, 'users');
  const [allUsers] = useCollectionData(allUsersRef);
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 5000);
    return () => clearInterval(timer);
  });

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const goToHome = () => navigate('/');
  const goToSettings = () => navigate('/settings');

  const [showNewModal, setShowNewModal] = useState(false);

  const handleOpenNewModal = () => setShowNewModal(true);
  const handleCloseNewModal = () => setShowNewModal(false);

  const handleTabClick = async (uid) => {
    setSearchTerm('');
    const userIds = [auth.currentUser.uid, uid];
    const chatId = await createChat(userIds);
    navigate(`/chats/${chatId}`);
  };

  return (
    <div className="Sidebar">
      <header>
        <img src={logoImg} alt="BooChat logo" onClick={goToHome} />

        <div className="row gap-16">
          <IconButton name="new" handleClick={handleOpenNewModal} />
          <IconButton name="settings" handleClick={goToSettings} />
        </div>
      </header>

      <section className="search">
        <TextInput
          type="search"
          icon="search"
          placeholder="Search"
          value={searchTerm}
          handleChange={handleSearchTermChange}
        />

        {searchTerm && (
          <>
            <p>Search results:</p>
            {filterUsers(allUsers, searchTerm).length ? (
              filterUsers(allUsers, searchTerm).map((user) => (
                <ContactTab
                  key={user.id}
                  userId={user.id}
                  handleClick={() => handleTabClick(user.id)}
                />
              ))
            ) : (
              <p
                className="grey"
                style={{ textAlign: 'center', padding: '12px' }}
              >
                No user found...
              </p>
            )}
          </>
        )}
      </section>

      {chats && !searchTerm && (
        <section className="chats">
          {chats
            .sort((a, b) => b.lastMessage.date - a.lastMessage.date)
            .map((chat) =>
              chat.members.length === 2 ? (
                <ChatTab
                  key={chat.id}
                  chatId={chat.id}
                  lastMessage={chat.lastMessage}
                  unreadCount={chat.unreadCount[auth.currentUser.uid]}
                  isActive={chat.id === chatId}
                  currentTime={currentTime}
                />
              ) : (
                <GroupChatTab
                  key={chat.id}
                  chatId={chat.id}
                  lastMessage={chat.lastMessage}
                  unreadCount={chat.unreadCount[auth.currentUser.uid]}
                  isActive={chat.id === chatId}
                  currentTime={currentTime}
                />
              )
            )}
        </section>
      )}

      <NewModal
        chats={chats}
        allUsers={allUsers}
        show={showNewModal}
        handleNext={handleTabClick}
        handleClose={handleCloseNewModal}
      />
    </div>
  );
};

const NewModal = ({ chats, allUsers, show, handleNext, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const handleTabClick = (uid) => {
    const selectedUsersCopy = [...selectedUsers];
    if (!selectedUsersCopy.includes(uid)) {
      selectedUsersCopy.push(uid);
      setSelectedUsers(selectedUsersCopy);
    } else {
      removeUserFromSelected(uid);
    }
  };

  const removeUserFromSelected = (uid) => {
    const selectedUsersCopy = [...selectedUsers];
    selectedUsersCopy.splice(selectedUsersCopy.indexOf(uid), 1);
    setSelectedUsers(selectedUsersCopy);
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 1) {
      handleNext(selectedUsers[0]);
    } else {
      const userIds = [auth.currentUser.uid, ...selectedUsers];
      const chatId = await createChat(userIds);
      navigate(`/chats/${chatId}`);
    }
    handleClose();
    setSearchTerm('');
    setSelectedUsers([]);
  };

  if (!chats || !allUsers) return null;

  return (
    <Modal show={show}>
      <header className="Modal_header">
        <h2>New {selectedUsers.length > 1 ? 'group' : 'message'}</h2>
      </header>

      <section className="Modal_section">
        <TextInput
          type="search"
          icon="search"
          placeholder="Search for users"
          id="new-modal-search"
          value={searchTerm}
          handleChange={handleSearchTermChange}
        />

        <div className="tags-row">
          {!!selectedUsers.length &&
            selectedUsers.map((uid) => (
              <ContactTag
                key={uid}
                userId={uid}
                handleClick={() => removeUserFromSelected(uid)}
              />
            ))}
        </div>

        {searchTerm && (
          <>
            <p>Search results:</p>
            {filterUsers(allUsers, searchTerm).length ? (
              filterUsers(allUsers, searchTerm).map((user) => (
                <ContactTab
                  key={user.id}
                  userId={user.id}
                  handleClick={() => handleTabClick(user.id)}
                />
              ))
            ) : (
              <p
                className="grey"
                style={{ textAlign: 'center', padding: '12px' }}
              >
                No user found...
              </p>
            )}
          </>
        )}

        {!searchTerm &&
          chats
            .filter((chat) => chat.members.length === 2)
            .map((chat) => {
              const uid = getOtherUserId(chat.id);
              return (
                <ContactTab
                  key={chat.id}
                  userId={uid}
                  handleClick={() => handleTabClick(uid)}
                  check={selectedUsers.includes(uid)}
                />
              );
            })}
      </section>

      <footer className="Modal_footer">
        <Button
          handleClick={handleSubmit}
          disabled={selectedUsers.length === 0}
        >
          Next
        </Button>
        <Button
          type="secondary"
          handleClick={() => {
            handleClose();
            setSearchTerm('');
            setSelectedUsers([]);
          }}
        >
          Cancel
        </Button>
      </footer>
    </Modal>
  );
};

export default Sidebar;
