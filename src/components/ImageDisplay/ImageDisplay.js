import IconButton from '../IconButton/IconButton';
import './ImageDisplay.css';

const ImageDisplay = ({ imageURL, handleClose }) => {
  if (!imageURL) return null;

  return (
    <div className="ImageDisplay">
      <div className="ImageDisplay_img-wrapper">
        <img src={imageURL} alt="preview" />
      </div>

      <IconButton
        name="close"
        type="primary"
        size="large"
        handleClick={handleClose}
      />
    </div>
  );
};

export default ImageDisplay;
