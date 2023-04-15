import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import ChatRoom from '../components/ChatRoom';

import '../styles/Home.css';

function Home() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    setAuthenticated(user);
  }, []);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  } else {
    return (
      <div className="Home">
        <Sidebar />
        <ChatRoom />
      </div>
    );
  }
}

export default Home;
