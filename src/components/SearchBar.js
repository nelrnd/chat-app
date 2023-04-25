import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import '../styles/SearchBar.css';

function SearchBar({ searchTerm, handleChange }) {
  return (
    <div className="SearchBar">
      <SearchIcon />
      <input
        type="search"
        placeholder="Search"
        className="filled"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
