import Modal from './Modal';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import ContactTab from '../ContactTab/ContactTab';
import { useEffect, useState } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { addAction, createChatRef, db, removeChatRef } from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  addUser as addUserToChat,
  removeUser as removeUserFromChat,
} from '../../firebase';

const ManageUsersModal = ({ users, userId, chatId, show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUsers, setCurrentUsers] = useState(users);

  const usersCollection = collection(db, 'users');
  const searchQuery = query(usersCollection, where('email', '==', searchTerm));
  const [results] = useCollectionData(searchQuery);
  let filteredResults = results && results.filter((user) => user.id !== userId);

  const handleChange = (e) => setSearchTerm(e.target.value);

  const addUser = (userId) => {
    setCurrentUsers([...currentUsers, { id: userId }]);
  };

  const removeUser = (userId) => {
    const copy = [...currentUsers];
    copy.splice(copy.indexOf(userId), 1);
    setCurrentUsers(copy);
  };

  const handleSubmit = async () => {
    const addedUsers = currentUsers.filter((u) => users.indexOf(u) === -1);
    const removedUsers = users.filter((u) => currentUsers.indexOf(u) === -1);

    for (let i = 0; i < addedUsers.length; i++) {
      await addUserToChat(addedUsers[i].id, chatId);
      await createChatRef(addedUsers[i].id, chatId);
      await addAction('add', [userId, addedUsers[i].id], chatId);
    }

    for (let i = 0; i < removedUsers.length; i++) {
      await removeUserFromChat(removedUsers[i].id, chatId);
      await removeChatRef(removedUsers[i].id, chatId);
      await addAction('remove', [userId, removedUsers[i].id], chatId);
    }

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
                {currentUsers.find((u) => u.id === user.id) ? (
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
              <ContactTab key={user.id} userId={user.id}>
                {user.id !== userId && (
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
