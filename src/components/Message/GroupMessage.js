import Message from './Message';
import Avatar from '../Avatar/Avatar';
import { getFormattedDate } from '../../utils';

const GroupMessage = ({
  text,
  imageURL,
  date,
  user,
  followUp,
  handleImageClick,
}) => {
  if (!user) return null;
  return (
    <div className={`GroupMessage ${followUp ? 'follow-up' : ''}`}>
      <div>
        {!followUp && <Avatar imageURL={user.profileURL} size="small" />}
      </div>
      <div>
        <Message
          text={text}
          imageURL={imageURL}
          isSent={false}
          followUp={followUp}
          handleImageClick={handleImageClick}
        />
        {!followUp && (
          <p className="sml-txt">
            <span className="bold">{user.name}</span>{' '}
            <span className="grey">{getFormattedDate(date)}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupMessage;
