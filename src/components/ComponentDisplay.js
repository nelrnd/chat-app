import Button from './Button/Button';
import Icon from './Icon/Icon';

const ComponentsDisplay = () => {
  return (
    <div>
      <Icon name="search" size="small" />
      <Icon name="send" />
      <Icon name="close" size="large" />

      <Button type="secondary">
        <Icon name="send" />
        Send
      </Button>
    </div>
  );
};

export default ComponentsDisplay;
