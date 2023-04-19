import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import '../styles/SearchBar.css';

function SearchBar({ searchTerm, handleSearchTermChange }) {
  return (
    <div className="SearchBar">
      <SearchIcon />
      <input
        type="search"
        placeholder="Search"
        className="filled"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
    </div>
  );
}

export default SearchBar;
