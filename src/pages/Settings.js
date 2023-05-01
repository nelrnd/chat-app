import { Navigate, useNavigate } from 'react-router-dom';
import { auth, updateUserInfo, uploadProfileImage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';

import { ReactComponent as EditIcon } from '../assets/icons/edit.svg';
import { ReactComponent as BackIcon } from '../assets/icons/back.svg';
import Layout from '../components/Layout';
import { signOut } from 'firebase/auth';
import Modal from '../components/Modal';
import { useEffect, useRef, useState } from 'react';

const logout = () => signOut(auth);

function Settings() {
  const [user, loading] = useAuthState(auth);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [copyBtnText, setCopyBtnText] = useState('COPY');
  const navigate = useNavigate();

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(user.uid);
    setCopyBtnText('COPIED');
    setTimeout(() => setCopyBtnText('COPY'), 1000);
  };

  const goBack = () => navigate('/');

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user) {
    return (
      <Layout>
        <Sidebar userId={user.uid} />

        <div style={{ overflowY: 'auto' }}>
          <header className="page-bar">
            <button className="back-btn" onClick={goBack}>
              <BackIcon />
            </button>

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

            <button className="secondary small" onClick={handleCopyToClipboard}>
              {copyBtnText}
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

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
    handleClose();
    clearFields();
  };

  useEffect(() => {
    if (show) {
      setNewName(name);
      setNewProfileURL(profileURL);
    }
  }, [show, name, profileURL]);

  return (
    <Modal show={show}>
      <form onSubmit={handleFormSubmit} className="flex-col gap-32">
        <h2>Edit profile</h2>

        <div className="flex-row gap-32 align-items">
          <Avatar imageURL={newProfileURL} size="large" />

          <div className="flex-row gap-16">
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
              <button
                className="secondary small"
                onClick={handleRemoveProfile}
                type="button"
              >
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
            type="button"
          >
            Cancel
          </button>
          <button className="small" type="submit">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default Settings;
