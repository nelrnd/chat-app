import Icon from '../Icon/Icon';
import './TextInput.css';

const TextInput = ({ label, icon, id, placeholder, value, handleChange }) => {
  return (
    <div className="TextInput">
      {label && (
        <label htmlFor={id} className="TextInput_label">
          {label}
        </label>
      )}

      {icon && <Icon name={icon} />}

      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={icon ? 'withIcon' : ''}
      />
    </div>
  );
};

export default TextInput;
