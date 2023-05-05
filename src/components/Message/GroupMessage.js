import Message from './Message';
import Avatar from '../Avatar/Avatar';
import useUserData from '../../hooks/useUserData';
import { getFormattedDate } from '../../utils';

const GroupMessage = ({
  text,
  imageURL,
  date,
  from,
  followUp,
  handleImageClick,
}) => {
  const [userData] = useUserData(from);

  if (!userData) return null;

  return (
    <div className={`GroupMessage ${followUp ? 'follow-up' : ''}`}>
      <div>
        {!followUp && <Avatar imageURL={userData.profileURL} size="small" />}
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
            <span className="bold">{userData.name}</span>{' '}
            <span className="grey">{getFormattedDate(date)}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupMessage;
