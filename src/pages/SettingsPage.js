import { signOut } from 'firebase/auth';
import Button from '../components/Button/Button';
import PageHeader from '../components/PageHeader/PageHeader';
import Avatar from '../components/Avatar/Avatar';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import Icon from '../components/Icon/Icon';

const logout = () => signOut(auth);

const SettingsPage = () => {
  const [user, loading] = useAuthState(auth);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user) {
    return (
      <div>
        <PageHeader>
          <h1>Settings</h1>
        </PageHeader>

        <section className="Settings_section row space-btw align">
          <div className="row gap-32 align">
            <Avatar imageURL={user.photoURL} size="large" />
            <div className="col gap-2">
              <h2>{user.displayName}</h2>
              <p className="grey">{user.email}</p>
            </div>
          </div>
          <Button>
            <Icon name="edit" />
            Edit
          </Button>
        </section>

        <section className="Settings_section">
          <Button size="large" handleClick={logout}>
            Logout
          </Button>
        </section>
      </div>
    );
  }
};

export default SettingsPage;
