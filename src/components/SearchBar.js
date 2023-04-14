import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import '../styles/SearchBar.css';

function SearchBar() {
  return (
    <div className="SearchBar">
      <SearchIcon />
      <input type="search" placeholder="Search" className="filled" />
    </div>
  );
}

export default SearchBar;
