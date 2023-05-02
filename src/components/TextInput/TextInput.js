import Icon from '../Icon/Icon';
import './TextInput.css';

const TextInput = ({
  label,
  icon,
  id,
  placeholder,
  value,
  handleChange,
  type = 'text',
  disabled = false,
  required = false,
  minLength,
}) => {
  return (
    <div className="TextInput">
      {label && (
        <label htmlFor={id} className="TextInput_label">
          {label}
        </label>
      )}

      {icon && <Icon name={icon} />}

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={icon ? 'withIcon' : null}
        disabled={disabled}
        required={required}
        minLength={minLength}
      />
    </div>
  );
};

export default TextInput;
