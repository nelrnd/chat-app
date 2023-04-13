import SearchBar from './SearchBar';
import ChatTabs from './ChatTabs';

import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="Sidebar">
      <header>
        <h1>Chat App</h1>
      </header>

      <SearchBar />

      <ChatTabs />
    </div>
  );
}

export default Sidebar;
