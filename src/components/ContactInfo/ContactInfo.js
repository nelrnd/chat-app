import Avatar from '../Avatar/Avatar';
import IconButton from '../IconButton/IconButton';
import PageHeader from '../PageHeader/PageHeader';
import './ContactInfo.css';

const ContactInfo = (props) => {
  return (
    <div className={`ContactInfo ${props.show ? 'show' : ''}`}>
      <PageHeader withBorder={false}>
        <h2>Contact info</h2>
        <IconButton name="close" handleClick={props.handleClose} />
      </PageHeader>

      <section>
        <Avatar imageURL={props.profileURL} size="large" />
        <div className="col gap-6 align">
          <h2>{props.name}</h2>
          <p className="grey">{props.email}</p>
        </div>
      </section>
    </div>
  );
};

export default ContactInfo;
