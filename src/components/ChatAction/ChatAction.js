import { useEffect, useState } from 'react';
import { getUserName } from '../../firebase';
import './ChatAction.css';

const actions = {
  updateProfile: (name) => `${name} updated the group profile picture.`,
  updateName: (name) => `${name} updated the group name.`,
  join: (name) => `${name} joined the group.`,
  left: (name) => `${name} left the group.`,
  add: (name1, name2) => `${name1} added ${name2} to the group.`,
  remove: (name1, name2) => `${name1} removed ${name2} from the group.`,
};

const ChatAction = ({ type, users }) => {
  const [names, setNames] = useState([]);

  useEffect(() => {
    if (names.length === users.length) return;

    const getName = async (user) => {
      return await getUserName(user);
    };

    setNames((n) => []);

    users.forEach(async (u) => {
      const name = await getName(u);
      setNames((n) => [...n, name]);
    });
  }, [users, names.length]);

  return (
    <p className="ChatAction">
      {names.length === users.length ? actions[type](...names) : null}
    </p>
  );
};

export default ChatAction;
