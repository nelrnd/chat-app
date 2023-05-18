import Icon from '../Icon/Icon';
import './IconButton.css';

const IconButton = ({
  name,
  type = 'secondary',
  size = 'small',
  handleClick,
  hideOnBig = false,
}) => {
  return (
    <button
      className={`IconButton ${type} ${size} ${hideOnBig ? 'hide-on-big' : ''}`}
      onClick={handleClick}
      type="button"
    >
      <Icon name={name} />
    </button>
  );
};

export default IconButton;
