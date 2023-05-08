import { signOut } from 'firebase/auth';
import Button from '../components/Button/Button';
import PageHeader from '../components/PageHeader/PageHeader';
import Avatar from '../components/Avatar/Avatar';
import { auth, updateUserInfo, uploadProfileImage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Icon from '../components/Icon/Icon';
import Modal from '../components/Modals/Modal';
import { useEffect, useState } from 'react';
import TextInput from '../components/TextInput/TextInput';
import FileInput from '../components/FileInput/FileInput';
import { useRef } from 'react';
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
          profileURL={user.photoURL}
          name={user.displayName}
          show={showModal}
          handleClose={closeModal}
        />
      </div>
    );
  }
};

const EditProfileModal = ({ profileURL, name, show, handleClose }) => {
  const [newProfileURL, setNewProfileURL] = useState(profileURL);
  const [newProfileFile, setNewProfileFile] = useState(null);
  const [newName, setNewName] = useState(name);
  const profileInput = useRef(null);

  const handleNameChange = (e) => setNewName(e.target.value);

  const handleProfileChange = (e) => {
    const [file] = e.target.files;
    if (file) {
      setNewProfileFile(file);
      setNewProfileURL(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfile = () => {
    setNewProfileFile(null);
    setNewProfileURL(null);
    profileInput.current.value = null;
  };

  const clearFields = () => {
    setNewProfileURL(profileURL);
    setNewName(name);
    profileInput.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedInfo = {};
      if (newProfileFile) {
        const imageURL = await uploadProfileImage(
          newProfileFile,
          auth.currentUser.uid
        );
        updatedInfo.photoURL = imageURL;
        setNewProfileURL(imageURL);
      }
      if (newProfileURL === null) {
        updatedInfo.photoURL = '';
      }
      if (newName !== name) {
        updatedInfo.displayName = newName;
      }
      await updateUserInfo(auth.currentUser, updatedInfo);
      clearFields();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  // Update infos each time it is changed
  useEffect(() => {
    if (show) {
      setNewName(name);
      setNewProfileURL(profileURL);
    }
  }, [show, name, profileURL]);

  return (
    <Modal show={show}>
      <form onSubmit={handleSubmit}>
        <header className="Modal_header">
          <h2>Edit profile</h2>
        </header>

        <section className="Modal_section col gap-32">
          <div className="row gap-24 align">
            <Avatar imageURL={newProfileURL} size="large" />

            <div className="col gap-6">
              <FileInput
                id="profile"
                size="small"
                ref={profileInput}
                handleChange={handleProfileChange}
              >
                Upload
              </FileInput>
              {newProfileURL && (
                <Button
                  size="small"
                  type="secondary"
                  handleClick={handleRemoveProfile}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div>
            <TextInput
              id="name"
              label="Name"
              value={newName}
              handleChange={handleNameChange}
            />
          </div>
        </section>

        <footer className="Modal_footer">
          <Button submit={true}>Save</Button>
          <Button
            type="secondary"
            handleClick={() => {
              clearFields();
              handleClose();
            }}
          >
            Cancel
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default withAuth(SettingsPage);
