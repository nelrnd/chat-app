import Modal from './Modal';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';
import { useEffect, useRef, useState } from 'react';
import Avatar from '../Avatar/Avatar';
import GroupAvatar from '../GroupAvatar/GroupAvatar';
import FileInput from '../FileInput/FileInput';
import { updateChatInfo, uploadImage } from '../../firebase.js';

const EditGroupModal = ({ chat, userProfiles, show, handleClose }) => {
  const [newName, setNewName] = useState(chat.name || '');
  const handleNameChange = (e) => setNewName(e.target.value);

  const [newProfileFile, setNewProfileFile] = useState(null);
  const [newProfileURL, setNewProfileURL] = useState(chat.profileURL || '');
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
    if (profileInput.current) {
      profileInput.current.value = null;
    }
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
        const imageURL = await uploadImage(newProfileFile, chat.id);
        updatedInfo.profileURL = imageURL;
        setNewProfileURL(imageURL);
      }
      if (newProfileURL === null) {
        updatedInfo.profileURL = '';
      }
      if (newName !== chat.name) {
        updatedInfo.name = newName;
      }
      await updateChatInfo(chat.id, updatedInfo);
      handleCancel();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (show) {
      setNewName(chat.name || '');
      setNewProfileURL(chat.profileURL || '');
    }
  }, [show, chat]);

  return (
    <Modal show={show}>
      <form onSubmit={handleSubmit}>
        <header className="Modal_header">
          <h2>Edit group</h2>
        </header>

        <section className="Modal_section row gap-24 align">
          {newProfileURL ? (
            <Avatar imageURL={newProfileURL} size="large" />
          ) : (
            <GroupAvatar imageURLs={userProfiles} size="large" />
          )}

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
            label="Group name"
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

export default EditGroupModal;
