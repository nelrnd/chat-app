import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { collection, doc, query, where } from 'firebase/firestore';
import { db, createChat } from '../../firebase';
import { ThemeContext } from '../../contexts/theme-context';
import logoLight from '../../assets/images/logo-light.png';
import logoDark from '../../assets/images/logo-dark.png';
import IconButton from '../IconButton/IconButton';
import TextInput from '../TextInput/TextInput';
import ChatTab from '../ChatTab/ChatTab';
import ContactTab from '../ContactTab/ContactTab';
import NewChatModal from '../Modals/NewChatModal';
import './Sidebar.css';

const Sidebar = ({ userId, hideOnSmall = false }) => {
  const [user] = useDocumentData(doc(db, 'users', userId));
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const goToHome = () => navigate('/');
  const goToSettings = () => navigate('/settings');

  const [showNewModal, setShowNewModal] = useState(false);
  const openNewModal = () => setShowNewModal(true);
  const closeNewModal = () => setShowNewModal(false);

  if (!user) return null;

  return (
    <aside className={`Sidebar ${hideOnSmall ? 'hide-on-small' : ''}`}>
      <header>
        <img
          src={theme === 'light' ? logoLight : logoDark}
          alt="BooChat logo"
          onClick={goToHome}
        />

        <div className="row gap-16">
          <IconButton name="new" handleClick={openNewModal} />
          <IconButton name="settings" handleClick={goToSettings} />
        </div>
      </header>

      <SidebarSearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        userId={user.id}
      />

      {!!user.chats.length && !searchTerm && (
        <SidebarChatsSection chatIds={user.chats} />
      )}

      <NewChatModal
        userId={user.id}
        userChats={user.chats}
        show={showNewModal}
        handleClose={closeNewModal}
      />
    </aside>
  );
};

const SidebarSearchSection = ({ searchTerm, setSearchTerm, userId }) => {
  const usersCollection = collection(db, 'users');
  const searchQuery = query(usersCollection, where('email', '==', searchTerm));
  const [results] = useCollectionData(searchQuery);

  const navigate = useNavigate();

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleClick = async (uid) => {
    setSearchTerm('');
    const userIds = [uid, userId];
    const chatId = await createChat(userIds);
    navigate('/chats/' + chatId);
  };

  return (
    <section className="search">
      <TextInput
        type="search"
        placeholder="Search for users"
        icon="search"
        value={searchTerm}
        handleChange={handleChange}
      />

      {searchTerm && (
        <>
          <p>Search results:</p>
          {results && results.length ? (
            results.map((user) => (
              <ContactTab
                key={user.id}
                userId={user.id}
                handleClick={
                  user.id !== userId ? () => handleClick(user.id) : null
                }
              />
            ))
          ) : (
            <p className="no-result">No user founds...</p>
          )}
        </>
      )}
    </section>
  );
};

const SidebarChatsSection = ({ chatIds }) => {
  const params = useParams();
  const currentChat = params.chatId;
  const chatsCollection = collection(db, 'chats');
  const chatsQuery = query(chatsCollection, where('id', 'in', chatIds));
  const [chats] = useCollectionData(chatsQuery);

  if (!chats) return;

  return (
    <section className="chats">
      {chats
        .sort((a, b) => b.lastMessage.date - a.lastMessage.date)
        .map((chat) => (
          <ChatTab
            key={chat.id}
            chat={chat}
            isActive={chat.id === currentChat}
          />
        ))}
    </section>
  );
};

export default Sidebar;
