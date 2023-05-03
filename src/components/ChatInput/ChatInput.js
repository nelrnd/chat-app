import Button from '../Button/Button';
import FileInput from '../FileInput/FileInput';
import Icon from '../Icon/Icon';
import TextInput from '../TextInput/TextInput';
import './ChatInput.css';

const ChatInput = () => {
  return (
    <div className="ChatInput">
      <FileInput id="image" type="secondary">
        <Icon name="image" />
      </FileInput>

      <TextInput placeholder="Type in something..." />

      <Button>
        <Icon name="send" />
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
