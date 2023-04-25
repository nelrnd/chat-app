import { db, createChat } from '../firebase';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ChatTabs from './ChatTabs';

import '../styles/Sidebar.css';
import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg';

function Sidebar({ userId, currentChat }) {
  const [userData] = useDocumentData(doc(db, 'users', userId));
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const handleSearchResultsTabClick = async (uid) => {
    // clear search term
    setSearchTerm('');
    // create new chat doc
    const userIds = [userData.uid, uid];
    const chatId = await createChat(userIds);
    // set current chat to chat Id
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
        handleSearchTermChange={handleSearchTermChange}
      />

      {searchTerm ? (
        <SearchResults
          searchTerm={searchTerm}
          handleSearchResultsTabClick={handleSearchResultsTabClick}
        />
      ) : (
        <ChatTabs
          chats={userData && userData.chats}
          currentChat={currentChat}
        />
      )}
    </div>
  );
}

export default Sidebar;
