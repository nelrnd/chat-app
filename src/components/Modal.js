import '../styles/Modal.css';

function Modal({ children, show }) {
  if (!show) return null;

  return (
    <div className="Modal_wrapper">
      <div className="Modal">{children}</div>
    </div>
  );
}

export default Modal;
