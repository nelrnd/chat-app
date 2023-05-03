import './Button.css';

const Button = ({
  type = 'primary',
  size = 'medium',
  handleClick,
  children,
  disabled,
  submit = false,
}) => {
  return (
    <button
      className={`Button ${type} ${size}`}
      onClick={handleClick}
      disabled={disabled}
      type={submit ? 'submit' : 'button'}
    >
      {children}
    </button>
  );
};

export default Button;
