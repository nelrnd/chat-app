import { useState } from 'react';
import { createChat, db, getOtherUserId } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Modal from './Modal';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';
import ContactTab from '../ContactTab/ContactTab';
import ContactTag from '../ContactTag/ContactTag';
import Icon from '../Icon/Icon';

const NewChatModal = ({ userId, userChats, show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  let type = selectedUsers.length > 1 ? 'group' : 'chat';
  const navigate = useNavigate();

  // get chats
  const chatsCollection = collection(db, 'chats');
  const chatsQuery =
    userChats.length && query(chatsCollection, where('id', 'in', userChats));
  const [chats] = useCollectionData(chatsQuery);

  // get users
  const usersCollection = collection(db, 'users');
  const searchQuery = query(usersCollection, where('email', '==', searchTerm));
  const [results] = useCollectionData(searchQuery);
  let filteredResults = results && results.filter((user) => user.id !== userId);

  const addUser = (userId) => {
    setSelectedUsers([...selectedUsers, userId]);
  };

  const removeUser = (userId) => {
    const copy = [...selectedUsers];
    copy.splice(copy.indexOf(userId), 1);
    setSelectedUsers(copy);
  };

  const handleClick = (userId) => {
    if (!selectedUsers.includes(userId)) {
      addUser(userId);
    } else {
      removeUser(userId);
    }
  };

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleSubmit = async () => {
    if (!selectedUsers.length) return;
    const userIds = [...selectedUsers, userId];
    const chatId = await createChat(userIds, userId);
    navigate('/chats/' + chatId);
    handleCancelClick();
  };

  const handleCancelClick = () => {
    setSearchTerm('');
    handleClose();
    setSelectedUsers([]);
  };

  return (
    <Modal show={show}>
      <header className="Modal_header">
        <h2>New {type}</h2>
      </header>

      <section className="Modal_section">
        <TextInput
          type="search"
          icon="search"
          placeholder="Search for users"
          id="new-modal-search"
          value={searchTerm}
          handleChange={handleChange}
        />

        <div className="tags-row">
          {!!selectedUsers.length &&
            selectedUsers.map((userId) => (
              <ContactTag
                key={userId}
                userId={userId}
                handleClick={() => removeUser(userId)}
              />
            ))}
        </div>

        {searchTerm ? (
          filteredResults && filteredResults.length ? (
            filteredResults.map((user) => (
              <ContactTab
                key={user.id}
                userId={user.id}
                handleClick={() => handleClick(user.id)}
                check={selectedUsers.includes(user.id)}
              >
                {selectedUsers.includes(user.id) && <Icon name="check" />}
              </ContactTab>
            ))
          ) : (
            <p>No results</p>
          )
        ) : (
          chats &&
          chats
            .filter((chat) => chat.members.length === 2)
            .map((chat) => {
              const otherUserId = getOtherUserId(chat.id);
              return (
                <ContactTab
                  key={chat.id}
                  userId={otherUserId}
                  handleClick={() => handleClick(otherUserId)}
                  check={selectedUsers.includes(otherUserId)}
                >
                  {selectedUsers.includes(otherUserId) && <Icon name="check" />}
                </ContactTab>
              );
            })
        )}
      </section>

      <footer className="Modal_footer">
        <Button handleClick={handleSubmit} disabled={!selectedUsers.length}>
          Next
        </Button>
        <Button handleClick={handleCancelClick} type="secondary">
          Cancel
        </Button>
      </footer>
    </Modal>
  );
};

export default NewChatModal;
