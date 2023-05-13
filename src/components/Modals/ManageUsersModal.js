import Modal from './Modal';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import ContactTab from '../ContactTab/ContactTab';
import { useEffect, useState } from 'react';
import { collection, query, where } from 'firebase/firestore';
import {
  createChatRef,
  db,
  removeChatRef,
  updateChatInfo,
} from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const ManageUsersModal = ({ users, userId, chatId, show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUsers, setCurrentUsers] = useState(users);

  const usersCollection = collection(db, 'users');
  const searchQuery = query(usersCollection, where('email', '==', searchTerm));
  const [results] = useCollectionData(searchQuery);
  let filteredResults = results && results.filter((user) => user.id !== userId);

  const handleChange = (e) => setSearchTerm(e.target.value);

  const addUser = (userId) => {
    setCurrentUsers([...currentUsers, userId]);
  };

  const removeUser = (userId) => {
    const copy = [...currentUsers];
    copy.splice(copy.indexOf(userId), 1);
    setCurrentUsers(copy);
  };

  const handleSubmit = async () => {
    const addedUsers = currentUsers.filter((u) => users.indexOf(u) === -1);
    const removedUsers = users.filter((u) => currentUsers.indexOf(u) === -1);

    addedUsers.forEach((user) => createChatRef(user, chatId));
    removedUsers.forEach((user) => removeChatRef(user, chatId));

    await updateChatInfo(chatId, { members: currentUsers });

    handleCancel();
  };

  const handleCancel = () => {
    setSearchTerm('');
    handleClose();
  };

  useEffect(() => {
    if (show) {
      setCurrentUsers(users);
    }
  }, [show, users]);

  return (
    <Modal show={show}>
      <header className="Modal_header">
        <h2>Manage users</h2>
      </header>

      <section className="Modal_section">
        <TextInput
          type="search"
          id="add-user"
          placeholder="Add user"
          value={searchTerm}
          handleChange={handleChange}
        />
      </section>

      <section className="Modal_section">
        {searchTerm ? (
          filteredResults && filteredResults.length ? (
            filteredResults.map((user) => (
              <ContactTab key={user.id} userId={user.id}>
                {currentUsers.includes(user.id) ? (
                  <Button size="small" handleClick={() => removeUser(user.id)}>
                    Remove
                  </Button>
                ) : (
                  <Button size="small" handleClick={() => addUser(user.id)}>
                    Add
                  </Button>
                )}
              </ContactTab>
            ))
          ) : (
            <p>No results</p>
          )
        ) : (
          currentUsers
            .sort((a) => (a === userId ? 1 : -1))
            .map((user) => (
              <ContactTab key={user} userId={user}>
                {user !== userId && (
                  <Button size="small" handleClick={() => removeUser(user)}>
                    Remove
                  </Button>
                )}
              </ContactTab>
            ))
        )}
      </section>

      <footer className="Modal_footer">
        <Button handleClick={handleSubmit}>Save</Button>
        <Button type="secondary" handleClick={handleCancel}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );
};

export default ManageUsersModal;
