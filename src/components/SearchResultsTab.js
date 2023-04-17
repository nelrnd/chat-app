import Avatar from './Avatar';
import '../styles/SearchResultsTab.css';

function SearchResultsTab(props) {
  return (
    <div className="SearchResultsTab" onClick={props.handleClick}>
      <Avatar imageUrl={props.profileUrl} size="small" />
      <h3>{props.name}</h3>
    </div>
  );
}

export default SearchResultsTab;
