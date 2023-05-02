import Button from './Button/Button';
import Icon from './Icon/Icon';
import TextInput from './TextInput/TextInput';

import IconButton from './IconButton/IconButton';
import Avatar from './Avatar/Avatar';

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

      <Avatar
        imageURL="https://images.unsplash.com/photo-1682704786682-a410529ec7b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
        size="large"
      />

      <Avatar
        imageURL="https://images.unsplash.com/photo-1682783432407-75b14dd288d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
        size="medium"
      />

      <Avatar
        imageURL="https://images.unsplash.com/photo-1681742030245-2efc2f04ef9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80"
        size="small"
      />

      <Avatar
        imageURL="https://images.unsplash.com/photo-1612194528832-e5336ec3ff9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
        size="mini"
      />
    </div>
  );
};

export default ComponentsDisplay;
