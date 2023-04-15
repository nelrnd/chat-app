import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

import SearchBar from './SearchBar';
import ChatTabs from './ChatTabs';

import '../styles/Sidebar.css';

const logout = () => signOut(auth);

function Sidebar() {
  return (
    <div className="Sidebar">
      <header>
        <h1>Chat App</h1>
      </header>

      <SearchBar />

      <ChatTabs />

      <button onClick={logout}>Log out</button>
    </div>
  );
}

export default Sidebar;
