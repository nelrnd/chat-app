import { getChatName } from '../../utils';
import Avatar from '../Avatar/Avatar';
import GroupAvatar from '../GroupAvatar/GroupAvatar';
import IconButton from '../IconButton/IconButton';
import PageHeader from '../PageHeader/PageHeader';
import './ChatInfo.css';

const ChatInfo = (props) => {
  return (
    <aside className="ChatInfo">
      <PageHeader>
        <h2>{type} info</h2>
        <IconButton name="close" />
      </PageHeader>

      {type === 'contact' ? <ContactInfo /> : <GroupInfo />}
    </aside>
  );
};

const ContactInfo = (props) => {
  return (
    <>
      <section>
        <Avatar imageURL={props.profileURL} size="large" />
        <h2>{props.name}</h2>
      </section>
    </>
  );
};

const GroupInfo = (props) => {
  return (
    <>
      <section>
        {props.profileURL ? (
          <Avatar imageURL={props.profileURL} size="large" />
        ) : (
          <GroupAvatar size="large" />
        )}
        <h2>{props.name || getChatName(props.member)}</h2>
      </section>
    </>
  );
};

export default ChatInfo;
