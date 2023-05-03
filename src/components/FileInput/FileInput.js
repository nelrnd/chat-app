import { forwardRef } from 'react';
import './FileInput.css';

const FileInput = forwardRef(function FileInput(
  {
    type = 'primary',
    size = 'medium',
    id,
    children,
    accept = 'image/*',
    handleChange,
  },
  ref
) {
  return (
    <>
      <label className={`FileInput ${type} ${size}`} htmlFor={id}>
        {children}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        ref={ref}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </>
  );
});

export default FileInput;
