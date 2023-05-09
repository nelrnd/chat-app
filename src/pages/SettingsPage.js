import { useState } from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import PageHeader from '../components/PageHeader/PageHeader';
import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import Icon from '../components/Icon/Icon';
import EditProfileModal from '../components/Modals/EditProfileModal';
import withAuth from './withAuth';

const logout = () => signOut(auth);

const SettingsPage = () => {
  const [user] = useAuthState(auth);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (user) {
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
          <Button handleClick={openModal}>
            <Icon name="edit" />
            Edit
          </Button>
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
