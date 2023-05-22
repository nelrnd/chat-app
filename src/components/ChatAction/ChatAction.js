import './ChatAction.css';

const actions = {
  updateProfile: (name) => `${name} updated the group profile picture.`,
  updateName: (name) => `${name} updated the group name.`,
  join: (name) => `${name} joined the group.`,
  left: (name) => `${name} left the group.`,
  add: (name1, name2) => `${name1} added ${name2} to the group.`,
  remove: (name1, name2) => `${name1} removed ${name2} from the group.`,
};

const ChatAction = ({ type, names }) => {
  return <p className="ChatAction">{actions[type](...names)}</p>;
};

export default ChatAction;
