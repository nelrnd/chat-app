import '../styles/Message.css';
import { getFormattedDate } from '../utils';

function Message({ text, imageURL, date, isSent }) {
  return (
    <div className={`Message_wrapper ${isSent ? 'sent' : 'received'}`}>
      {imageURL && <img src={imageURL} alt={text} />}

      {text && <div className="Message">{text}</div>}

      <div className="Message_date small">
        {getFormattedDate(date, Date.now())}
      </div>
    </div>
  );
}

export default Message;
