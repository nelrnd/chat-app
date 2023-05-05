import Avatar from '../Avatar/Avatar';
import GroupAvatar from '../GroupAvatar/GroupAvatar';
import IconButton from '../IconButton/IconButton';
import PageHeader from '../PageHeader/PageHeader';
import '../ContactInfo/ContactInfo.css';

const GroupInfo = (props) => {
  return (
    <div className={`ContactInfo ${props.show ? 'show' : ''}`}>
      <PageHeader withBorder={false}>
        <h2>Group info</h2>
        <IconButton name="close" handleClick={props.handleClose} />
      </PageHeader>

      <section>
        {props.profileURL ? (
          <Avatar imageURL={props.profileURL} size="large" />
        ) : (
          <GroupAvatar imageURLs={props.imageURLs} size="large" />
        )}
        <h2>{props.groupName}</h2>
      </section>
    </div>
  );
};

export default GroupInfo;
