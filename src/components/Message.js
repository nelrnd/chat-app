import '../styles/Message.css';

function Message({ content, date, isSent }) {
  return (
    <div className={`Message_wrapper ${isSent ? 'sent' : 'received'}`}>
      <div className="Message">{content}</div>
      <div className="Message_date small">{date}</div>
    </div>
  );
}

export default Message;
