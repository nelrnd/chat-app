import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ChatTabs from './ChatTabs';

import '../styles/Sidebar.css';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg';

const logout = () => signOut(auth);

function Sidebar({
  searchTerm,
  handleSearchTermChange,
  userId,
  currentChat,
  handleChatTabClick,
  handleSearchResultsTabClick,
}) {
  const [userData] = useDocumentData(doc(db, 'users', userId));

  return (
    <div className="Sidebar">
      <header>
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
          handleChatTabClick={handleChatTabClick}
        />
      )}

      <button onClick={logout}>Log out</button>
    </div>
  );
}

export default Sidebar;
