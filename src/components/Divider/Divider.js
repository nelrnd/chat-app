import './Divider.css';

const Divider = ({ text = 'or' }) => {
  return (
    <div className="Divider">
      <div className="Divider_text">{text}</div>
    </div>
  );
};

export default Divider;
