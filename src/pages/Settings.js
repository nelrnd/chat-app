import { Navigate } from 'react-router-dom';
import { auth, storage, updateUserInfo } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';

import { ReactComponent as EditIcon } from '../assets/icons/edit.svg';
import { ReactComponent as CopyIcon } from '../assets/icons/clipboard.svg';
import Layout from '../components/Layout';
import { signOut, updateProfile } from 'firebase/auth';
import Modal from '../components/Modal';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const logout = () => signOut(auth);

function Settings() {
  const [user, loading] = useAuthState(auth);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user) {
    return (
      <Layout>
        <Sidebar userId={user.uid} />

        <div>
          <header className="page-bar">
            <h2 className="large single-line">Settings</h2>
          </header>

          <section className="page-section">
            <div className="row">
              <Avatar imageURL={user.photoURL} size="large" />
              <div>
                <h3>{user.displayName}</h3>
                <p className="grey">{user.email}</p>
              </div>
            </div>

            <button
              className="secondary small"
              onClick={() => setShowEditProfileModal(true)}
            >
              <EditIcon />
              EDIT
            </button>
          </section>

          <section className="page-section">
            <div>
              <p className="grey">This is how people can find you:</p>
              <h3>{user.uid}</h3>
            </div>

            <button className="secondary small">
              <CopyIcon />
              COPY
            </button>
          </section>

          <section className="page-section">
            <button onClick={logout} className="full-width">
              Logout
            </button>
          </section>
        </div>

        <EditProfileModal
          show={showEditProfileModal}
          profileURL={user.photoURL}
          name={user.displayName}
          userId={user.uid}
          handleClose={() => setShowEditProfileModal(false)}
        />
      </Layout>
    );
  }
}

function EditProfileModal({ show, name, profileURL, userId, handleClose }) {
  const [newProfileURL, setNewProfileURL] = useState(profileURL);
  const [newProfileFile, setNewProfileFile] = useState();
  const [newName, setNewName] = useState(name);

  const profileInput = useRef();

  const handleNameChange = (e) => setNewName(e.target.value);

  const handleUploadProfile = (e) => {
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

  const handleSave = async () => {
    if (newProfileFile) {
      // upload new profile to firebase cloud storage and get URL
      const metadata = { contentType: newProfileFile.type };
      const imageFormat = newProfileFile.type.split('/')[1];
      const filePath = '/profiles/' + userId + imageFormat;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, newProfileFile, metadata);
      const profileURL = await getDownloadURL(storageRef);
      setNewProfileURL(profileURL);
    }

    // update user's profile information
    const updatedProfileInfo = {};
    if (newProfileURL !== profileURL) {
      updatedProfileInfo.photoURL = newProfileURL || '';
    }
    if (newName !== name) {
      updatedProfileInfo.displayName = newName;
    }
    await updateProfile(auth.currentUser, updatedProfileInfo);

    await updateUserInfo(userId, updatedProfileInfo);

    clearFields();
    handleClose();
  };

  useEffect(() => {
    if (show) {
      setNewName(name);
      setNewProfileURL(profileURL);
    }
  }, [show, name, profileURL]);

  return (
    <Modal show={show}>
      <h2>Edit profile</h2>

      <div className="flex-row gap32 align-items">
        <Avatar imageURL={newProfileURL} size="large" />

        <div className="flex-row gap16">
          <label htmlFor="new-profile-pic" className="button small">
            Upload
          </label>
          <input
            type="file"
            accept="image/*"
            name="new-profile-pic"
            id="new-profile-pic"
            onChange={handleUploadProfile}
            ref={profileInput}
            className="hidden"
          />
          {newProfileURL && (
            <button className="secondary small" onClick={handleRemoveProfile}>
              Remove
            </button>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={name}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="outline"
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div className="row-left">
        <button
          onClick={() => {
            handleClose();
            clearFields();
          }}
          className="secondary small"
        >
          Cancel
        </button>
        <button className="small" onClick={handleSave}>
          Save
        </button>
      </div>
    </Modal>
  );
}

export default Settings;
