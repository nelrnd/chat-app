import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Sidebar from '../components/Sidebar';

import '../styles/Home.css';
import { auth } from '../firebase';

function Home() {
  const [user, loading] = useAuthState(auth);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user) {
    return <Sidebar userId={user.uid} />;
  }
}

export default Home;
