import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ChatTabs from './ChatTabs';

import '../styles/Sidebar.css';

const logout = () => signOut(auth);

function Sidebar({
  searchTerm,
  handleSearchTermChange,
  currentChat,
  handleChatTabClick,
  handleSearchResultsTabClick,
}) {
  return (
    <div className="Sidebar">
      <header>
        <h1>Chat App</h1>
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
          currentChat={currentChat}
          handleChatTabClick={handleChatTabClick}
        />
      )}

      <button onClick={logout}>Log out</button>
    </div>
  );
}

export default Sidebar;
