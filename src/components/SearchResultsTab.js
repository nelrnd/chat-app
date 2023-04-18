import Avatar from './Avatar';
import '../styles/SearchResultsTab.css';

function SearchResultsTab({ name, profileURL, handleClick }) {
  return (
    <div className="SearchResultsTab" onClick={handleClick}>
      <Avatar imageURL={profileURL} size="small" />
      <h3>{name}</h3>
    </div>
  );
}

export default SearchResultsTab;
