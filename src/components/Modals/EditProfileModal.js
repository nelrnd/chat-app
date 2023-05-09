import { useEffect, useRef, useState } from 'react';
import { updateUserInfo, uploadProfileImage } from '../../firebase';
import Modal from './Modal';
import Avatar from '../Avatar/Avatar';
import FileInput from '../FileInput/FileInput';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';

const EditProfileModal = ({ user, show, handleClose }) => {
  const [newName, setNewName] = useState(user.displayName || '');
  const handleNameChange = (e) => setNewName(e.target.value);

  const [newProfileFile, setNewProfileFile] = useState(null);
  const [newProfileURL, setNewProfileURL] = useState(user.photoURL);
  const profileInput = useRef(null);
  const handleProfileChange = (e) => {
    const [file] = e.target.files;
    if (file) {
      setNewProfileFile(file);
      setNewProfileURL(URL.createObjectURL(file));
    }
  };
  const removeProfile = () => {
    setNewProfileFile(null);
    setNewProfileURL(null);
    profileInput.current.value = null;
  };

  const handleCancel = () => {
    removeProfile();
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedInfo = {};
      if (newProfileFile) {
        const imageURL = await uploadProfileImage(newProfileFile, user.uid);
        updatedInfo.photoURL = imageURL;
        setNewProfileURL(imageURL);
      }
      if (newProfileURL === null) {
        updatedInfo.photoURL = '';
      }
      if (newName !== user.displayName) {
        updatedInfo.displayName = newName;
      }
      await updateUserInfo(user, updatedInfo);
      handleCancel();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (show) {
      setNewName(user.displayName || '');
      setNewProfileURL(user.photoURL || '');
    }
  }, [show, user]);

  return (
    <Modal show={show}>
      <form onSubmit={handleSubmit}>
        <header className="Modal_header">
          <h2>Edit profile</h2>
        </header>

        <section className="Modal_section row gap-24 align">
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
              <Button size="small" type="secondary" handleClick={removeProfile}>
                Remove
              </Button>
            )}
          </div>
        </section>

        <section className="Modal_section">
          <TextInput
            id="name"
            label="Name"
            value={newName}
            handleChange={handleNameChange}
          />
        </section>

        <footer className="Modal_footer">
          <Button submit={true}>Save</Button>
          <Button type="secondary" handleClick={handleCancel}>
            Cancel
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
