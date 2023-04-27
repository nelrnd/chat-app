import { useRef, useState } from 'react';
import { ReactComponent as ImageIcon } from '../assets/icons/image.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

import '../styles/ChatMessageInput.css';

function ChatMessageInput({ chatId }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState();
  let imageURL = image && URL.createObjectURL(image);

  const imageInput = useRef();

  const handleTextChange = (e) => setText(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handleClearImage = () => {
    setImage(null);
    imageInput.current.value = null;
  };

  return (
    <div className="ChatMessageInput">
      {imageURL && (
        <ImagePreview imageURL={imageURL} handleClick={handleClearImage} />
      )}

      <form>
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
