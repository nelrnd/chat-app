import './Button.css';

const Button = ({
  type = 'primary',
  size = 'medium',
  handleClick,
  children,
}) => {
  return (
    <button className={`Button ${type} ${size}`} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
