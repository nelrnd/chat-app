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
import { db, auth } from '../../firebase';
import ChatTab from '../ChatTab/ChatTab';

const Sidebar = () => {
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const [userData] = useDocumentData(userRef);
  const chatsRef = collection(db, 'chats');
  const chatsQuery =
    userData && query(chatsRef, where('id', 'in', userData.chats));
  const [chats] = useCollectionData(chatsQuery);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const goToHome = () => navigate('/');
  const goToSettings = () => navigate('/settings');

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
      </section>

      {chats && !searchTerm && (
        <section className="chats">
          {chats.map((chat) => (
            <ChatTab
              key={chat.id}
              chatId={chat.id}
              lastMessage={chat.lastMessage}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default Sidebar;
