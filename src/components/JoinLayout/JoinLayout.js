import './JoinLayout.css';
import illustration from '../../assets/images/people-chatting.svg';

const JoinLayout = ({ children }) => {
  return (
    <div className="JoinLayout">
      <div className="JoinLayout_content">
        <div>
          <img src={illustration} alt="people chatting online" />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default JoinLayout;
