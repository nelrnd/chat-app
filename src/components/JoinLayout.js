import Illustration from '../assets/images/people-chatting.svg';
import '../styles/JoinLayout.css';

function JoinLayout({ children }) {
  return (
    <div className="JoinLayout">
      <div className="JoinLayout_grid">
        <div className="img-wrapper">
          <img src={Illustration} alt="People chatting" />
        </div>

        <div className="form-wrapper">{children}</div>
      </div>
    </div>
  );
}

export default JoinLayout;
