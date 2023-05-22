import { useRef, useState } from 'react';
import Button from '../Button/Button';
import FileInput from '../FileInput/FileInput';
import Icon from '../Icon/Icon';
import TextInput from '../TextInput/TextInput';
import IconButton from '../IconButton/IconButton';
import './ChatInput.css';
import {
  auth,
  createChatMessage,
  createChatRefs,
  incrementUnreadCount,
  updateLastChatMessage,
  uploadImage,
} from '../../firebase';

const ChatInput = ({ chatId, isFirstMessage }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState();
  let imageURL = image && URL.createObjectURL(image);
  const imageInput = useRef(null);

  const handleTextChange = (e) => setText(e.target.value);

  const handleImageChange = (e) => {
    const [file] = e.target.files;
    if (file) setImage(file);
  };

  const handleClearImage = () => {
    setImage(null);
    imageInput.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setText((t) => t.trim());
    if (!text && !image) return;
    const message = { from: auth.currentUser.uid, date: Date.now() };
    if (text) {
      message.text = text;
      setText('');
    }
    if (image) {
      const imageCopy = image;
      handleClearImage();
      const imageURL = await uploadImage(imageCopy, auth.currentUser.uid);
      message.imageURL = imageURL;
    }
    if (isFirstMessage) {
      await createChatRefs(chatId);
    }

    await incrementUnreadCount(chatId, auth.currentUser.uid);
    await createChatMessage(chatId, message);
    await updateLastChatMessage(chatId, auth.currentUser.uid, message);
  };

  return (
    <form className="ChatInput" onSubmit={handleSubmit}>
      {imageURL && (
        <ImagePreview imageURL={imageURL} handleClick={handleClearImage} />
      )}

      <FileInput
        id="image"
        type="secondary"
        handleChange={handleImageChange}
        ref={imageInput}
      >
        <Icon name="image" />
      </FileInput>

      <TextInput
        placeholder="Type in something..."
        value={text}
        handleChange={handleTextChange}
      />

      <Button submit={true}>
        <Icon name="send" />
        <span className="hide-on-small">Send</span>
      </Button>
    </form>
  );
};

const ImagePreview = ({ imageURL, handleClick }) => {
  return (
    <div className="ImagePreview">
      <IconButton name="close" type="primary" handleClick={handleClick} />
      <img src={imageURL} alt="Preview" />
    </div>
  );
};

export default ChatInput;
