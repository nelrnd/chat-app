import { db, createChat, auth } from '../firebase';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ChatTabs from './ChatTabs';

import '../styles/Sidebar.css';
import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg';

function Sidebar({ currentChat }) {
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const [userData] = useDocumentData(userRef);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const handleSearchResultsTabClick = async (uid) => {
    setSearchTerm('');
    const userIds = [auth.currentUser.uid, uid];
    const chatId = await createChat(userIds);
    navigate(`/chats/${chatId}`);
  };

  return (
    <div className="Sidebar">
      <header className="Sidebar_header">
        <h1>Chat App</h1>

        <Link to="/settings" className="icon-btn">
          <SettingsIcon />
        </Link>
      </header>

      <SearchBar
        searchTerm={searchTerm}
        handleChange={handleSearchTermChange}
      />

      {userData ? (
        searchTerm ? (
          <SearchResults
            searchTerm={searchTerm}
            handleClick={handleSearchResultsTabClick}
          />
        ) : userData.chats && userData.chats.length ? (
          <ChatTabs chatIds={userData.chats} currentChat={currentChat} />
        ) : null
      ) : null}
    </div>
  );
}

export default Sidebar;
