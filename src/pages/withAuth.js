import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';

const UpdatedComponent = (Component) => {
  const NewComponent = (props) => {
    const [user, loading] = useAuthState(auth);

    if (!user && !loading) {
      return <Navigate to="/login" replace />;
    } else if (user) {
      return <Component />;
    }
  };
  return NewComponent;
};

export default UpdatedComponent;
