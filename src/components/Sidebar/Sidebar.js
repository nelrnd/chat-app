import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import IconButton from '../IconButton/IconButton';
import TextInput from '../TextInput/TextInput';
import './Sidebar.css';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { collection, doc, query, where } from 'firebase/firestore';
import { db, auth, createChat } from '../../firebase';
import ChatTab from '../ChatTab/ChatTab';
import ContactTab from '../ContactTab/ContactTab';

const Sidebar = () => {
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
  let filteredUsers =
    allUsers &&
    allUsers
      .filter((user) => user.id !== auth.currentUser.uid)
      .filter((user) => user.email.toLowerCase() === searchTerm.toLowerCase());
  const navigate = useNavigate();

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const goToHome = () => navigate('/');
  const goToSettings = () => navigate('/settings');

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
          <IconButton name="new" />
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
            {filteredUsers.length ? (
              filteredUsers.map((user) => (
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
          {chats.map((chat) => (
            <ChatTab
              key={chat.id}
              chatId={chat.id}
              lastMessage={chat.lastMessage}
              unreadCount={chat.unreadCount[auth.currentUser.uid]}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default Sidebar;
