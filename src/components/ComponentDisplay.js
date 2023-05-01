import Button from './Button/Button';
import Icon from './Icon/Icon';

import IconButton from './IconButton/IconButton';

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

      <IconButton name="close" type="primary" size="large" />

      <IconButton name="settings" />
    </div>
  );
};

export default ComponentsDisplay;
