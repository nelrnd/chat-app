import './GroupAvatar.css';
import Avatar from '../Avatar/Avatar';

const GroupAvatar = ({ imageURLs, size = 'medium', nbOfPeople }) => {
  const peopleClass =
    'people-' +
    (nbOfPeople ? (nbOfPeople > 5 ? '4-plus' : nbOfPeople) : imageURLs.length);

  return (
    <div className={`GroupAvatar ${size} ${peopleClass}`}>
      {!nbOfPeople || nbOfPeople < 5 ? (
        imageURLs.map((imgURL, id) => <Avatar key={id} imageURL={imgURL} />)
      ) : (
        <>
          {imageURLs.slice(0, 3).map((imgURL, id) => (
            <Avatar key={id} imageURL={imgURL} />
          ))}
          <div className="GroupAvatar_people-label">+{nbOfPeople - 3}</div>
        </>
      )}
    </div>
  );
};

export default GroupAvatar;
