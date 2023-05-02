import Icon from '../Icon/Icon';
import './FileInput.css';

const FileInput = ({ id, type = 'image/*' }) => {
  return (
    <>
      <label className="FileInput" htmlFor={id}>
        <Icon name="image" />
      </label>
      <input id={id} type="file" accept="image/*" style={{ display: 'none' }} />
    </>
  );
};

export default FileInput;
