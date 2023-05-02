import './JoinLayout.css';
import illustration from '../../assets/images/people-chatting.svg';

const JoinLayout = ({ children }) => {
  return (
    <div className="JoinLayout">
      <div className="col">
        <img src={illustration} alt="people chatting online" />
      </div>
      <div className="col">{children}</div>
    </div>
  );
};

export default JoinLayout;
