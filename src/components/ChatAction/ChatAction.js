import '../ChatAction.css';

const actions = {
  add: (user1, user2) => user1 + ' added ' + user2 + ' to the group.',
  remove: (user1, user2) => user1 + ' removed ' + user2 + ' from the group.',
  join: (user) => user + ' joined the group.',
  leave: (user) => user + ' left the group.',
};

const ChatAction = ({ action, users }) => {
  return <p className="ChatAction">{actions[action](...users)}</p>;
};

export default ChatAction;
