import Modal from './Modal';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import ContactTab from '../ContactTab/ContactTab';
import { useState } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const ManageUsersModal = ({ users, userId, show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const otherUsers = users.filter((user) => user.id !== userId);

  const usersCollection = collection(db, 'users');
  const searchQuery = query(usersCollection, where('email', '==', searchTerm));
  const [results] = useCollectionData(searchQuery);
  let filteredResults = results && results.filter((user) => user.id !== userId);

  const handleChange = (e) => setSearchTerm(e.target.value);

  return (
    <Modal show={show}>
      <header className="Modal_header">
        <h2>Manage users</h2>
      </header>

      <section className="Modal_section">
        <TextInput
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
              <ContactTab key={user.id} userId={user.id} />
            ))
          ) : (
            <p>No results</p>
          )
        ) : (
          otherUsers
            .concat(users.find((u) => u.id === userId))
            .map((user) => <ContactTab key={user.id} userId={user.id} />)
        )}
      </section>

      <footer className="Modal_footer">
        <Button>Save</Button>
        <Button type="secondary" handleClick={handleClose}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );
};

export default ManageUsersModal;
