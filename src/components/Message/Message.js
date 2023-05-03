import { getFormattedDate } from '../../utils';
import './Message.css';

const Message = ({
  text,
  imageURL,
  date,
  isSent,
  followUp,
  handleImageClick,
}) => {
  return (
    <div
      className={`Message_wrapper ${isSent ? 'sent' : 'received'} ${
        followUp ? 'follow-up' : ''
      }`}
    >
      {imageURL && (
        <img
          src={imageURL}
          alt="thumbnail"
          className="Message_image"
          onClick={() => handleImageClick(imageURL)}
        />
      )}
      {text && <div className="Message">{text}</div>}
      {date && !followUp && (
        <div className="Message_date">{getFormattedDate(date)}</div>
      )}
    </div>
  );
};

export default Message;
