import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import ChatRoom from '../components/ChatRoom';

import '../styles/Home.css';

function Home() {
  const [user, loading] = useAuthState(auth);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user && !loading) {
    return (
      <div className="Home">
        <Sidebar />
        <ChatRoom />
      </div>
    );
  }
}

export default Home;
