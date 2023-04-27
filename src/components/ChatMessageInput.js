import { useRef, useState } from 'react';
import { ReactComponent as ImageIcon } from '../assets/icons/image.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

import '../styles/ChatMessageInput.css';
import {
  auth,
  createChatMessage,
  createChatRefs,
  incrementUnreadCount,
  updateLastChatMessage,
  uploadImage,
} from '../firebase';
import { getUserIds } from '../utils';

function ChatMessageInput({ chatId, isFirstMessage }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState();
  let imageURL = image && URL.createObjectURL(image);

  const imageInput = useRef();

  const handleTextChange = (e) => setText(e.target.value);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    console.log(e.target.files[0]);
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
      const imageURL = await uploadImage(image, auth.currentUser.uid);
      message.imageURL = imageURL;
      handleClearImage();
    }

    if (isFirstMessage) {
      const userIds = getUserIds(chatId);
      createChatRefs(userIds, chatId);
    }

    await incrementUnreadCount(chatId, auth.currentUser.uid);
    await createChatMessage(chatId, message);
    await updateLastChatMessage(chatId, auth.currentUser.uid, message);
  };

  return (
    <div className="ChatMessageInput">
      {imageURL && (
        <ImagePreview imageURL={imageURL} handleClick={handleClearImage} />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="messageImage"
          id="messageImage"
          accept="image/*"
          ref={imageInput}
          onChange={handleImageChange}
          className="hidden"
        />

        <label htmlFor="messageImage" className="icon-btn">
          <ImageIcon />
        </label>

        <input
          type="text"
          name="messageText"
          id="messageText"
          placeholder="Type in something..."
          value={text}
          onChange={handleTextChange}
          className="filled"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function ImagePreview({ imageURL, handleClick }) {
  return (
    <div className="ChatMessageInput_image-preview">
      <button className="close-btn" type="button" onClick={handleClick}>
        <CloseIcon />
      </button>
      <img src={imageURL} alt="Preview" />
    </div>
  );
}

export default ChatMessageInput;
