import Icon from '../Icon/Icon';
import './IconButton.css';

const IconButton = ({
  name,
  type = 'secondary',
  size = 'small',
  handleClick,
}) => {
  return (
    <button
      className={`IconButton ${type} ${size}`}
      onClick={handleClick}
      type="button"
    >
      <Icon name={name} />
    </button>
  );
};

export default IconButton;
