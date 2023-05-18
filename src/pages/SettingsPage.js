import { useState, useContext } from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { ThemeContext } from '../contexts/theme-context';
import PageHeader from '../components/PageHeader/PageHeader';
import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import Icon from '../components/Icon/Icon';
import EditProfileModal from '../components/Modals/EditProfileModal';
import withAuth from './withAuth';
import IconButton from '../components/IconButton/IconButton';
import { useNavigate } from 'react-router-dom';

const logout = () => signOut(auth);

const SettingsPage = () => {
  const [user] = useAuthState(auth);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { theme, setTheme } = useContext(ThemeContext);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleThemeClick = (theme) => {
    setTheme(theme);
  };

  if (user) {
    return (
      <div className="auto-scroll">
        <PageHeader>
          <IconButton
            name="back"
            handleClick={() => navigate('/')}
            hideOnBig={true}
          />
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
          <Button handleClick={openModal}>
            <Icon name="edit" />
            Edit
          </Button>
        </section>

        <section className="Settings_section">
          <h2>Theme</h2>

          <div className="theme-options">
            <input
              type="radio"
              name="theme"
              id="light"
              value="light"
              onChange={(e) => handleThemeClick(e.target.value)}
              checked={theme === 'light'}
            />
            <label htmlFor="light">Light</label>

            <input
              type="radio"
              name="theme"
              id="dark"
              value="dark"
              onChange={(e) => handleThemeClick(e.target.value)}
              checked={theme === 'dark'}
            />
            <label htmlFor="dark">Dark</label>
          </div>
        </section>

        <section className="Settings_section">
          <Button size="large" handleClick={logout}>
            Logout
          </Button>
        </section>

        <EditProfileModal
          user={user}
          show={showModal}
          handleClose={closeModal}
        />
      </div>
    );
  }
};

export default withAuth(SettingsPage);
