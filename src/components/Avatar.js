import '../styles/Avatar.css';

function Avatar({ imageUrl, size = 64 }) {
  return (
    <div
      className="Avatar"
      style={{ backgroundImage: `url(${imageUrl})`, width: size, height: size }}
    ></div>
  );
}

export default Avatar;
