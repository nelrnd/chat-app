import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';

const HomePage = () => {
  const [user, loading] = useAuthState(auth);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }
  return <div></div>;
};

export default HomePage;
