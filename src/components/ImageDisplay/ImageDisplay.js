import IconButton from '../IconButton/IconButton';
import './ImageDisplay.css';

const ImageDisplay = ({ imageURL, handleClose }) => {
  if (!imageURL) return null;

  return (
    <div className="ImageDisplay">
      <img src={imageURL} alt="preview" />

      <IconButton
        name="close"
        type="primary"
        size="large"
        handleClick={handleClose}
      />

      <div className="ImageDisplay_backdrop" onClick={handleClose} />
    </div>
  );
};

export default ImageDisplay;
