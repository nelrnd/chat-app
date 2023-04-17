import { useState } from 'react';
import { auth, createNewChatDocument } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import ChatRoom from '../components/ChatRoom';

import '../styles/Home.css';

function Home() {
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, loading] = useAuthState(auth);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChatTabClick = (id) => {
    setCurrentChat(id);
  };

  const handleSearchResultsTabClick = async (uid) => {
    // clear search term
    setSearchTerm('');

    // create new chat doc
    const chatId = await createNewChatDocument(uid, auth.currentUser.uid);

    // set current chat to chat Id
    setCurrentChat(chatId);
  };

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user && !loading) {
    return (
      <div className="Home">
        <Sidebar
          searchTerm={searchTerm}
          handleSearchTermChange={handleSearchTermChange}
          currentChat={currentChat}
          handleChatTabClick={handleChatTabClick}
          handleSearchResultsTabClick={handleSearchResultsTabClick}
        />
        {currentChat && <ChatRoom currentChat={currentChat} />}
      </div>
    );
  }
}

export default Home;
