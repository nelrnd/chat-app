import './Button.css';

const Button = ({
  type = 'primary',
  size = 'medium',
  handleClick,
  children,
  disabled,
}) => {
  return (
    <button
      className={`Button ${type} ${size}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
