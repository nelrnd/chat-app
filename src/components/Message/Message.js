import './Message.css';

const Message = ({ text, imageURL, isSent, handleImageClick }) => {
  return (
    <div className={`Message_wrapper ${isSent ? 'sent' : 'received'}`}>
      {imageURL && (
        <img
          src={imageURL}
          alt="thumbnail"
          className="Message_image"
          onClick={() => handleImageClick(imageURL)}
        />
      )}
      {text && <div className="Message">{text}</div>}
      <div className="Message_date">10:32 AM</div>
    </div>
  );
};

export default Message;
