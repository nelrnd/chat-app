import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';
import './ContactTag.css';

const ContactTag = (props) => {
  return (
    <div className="ContactTag" onClick={props.handleClick}>
      <Avatar imageURL={props.imageURL} size="mini" />
      <h3>{props.name}</h3>
      <Icon name="close" size="small" />
    </div>
  );
};

export default ContactTag;
