import Button from './Button/Button';
import Icon from './Icon/Icon';
import TextInput from './TextInput/TextInput';

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

      <TextInput
        label="Email"
        icon="search"
        id="email"
        placeholder="Your email"
      />
    </div>
  );
};

export default ComponentsDisplay;
