import '../styles/Message.css';

function Message(props) {
  const messageClass = props.isSent ? 'sent' : 'received';

  return (
    <div className="Message_wrapper">
      <div className={`Message ${messageClass}`}>{props.text}</div>
      <div className="Message_date small">{props.date}</div>
    </div>
  );
}

export default Message;
