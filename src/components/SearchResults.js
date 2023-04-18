import { collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SearchResultsTab from './SearchResultsTab';

import '../styles/SearchResults.css';

function SearchResults({ searchTerm, handleSearchResultsTabClick }) {
  const allUsersRef = collection(db, 'users');
  const [allUsers] = useCollectionData(allUsersRef);

  let usersFromSearch =
    allUsers &&
    allUsers
      .filter((user) => user.uid !== auth.currentUser.uid)
      .filter(
        (user) =>
          user.email.toLowerCase() === searchTerm.toLowerCase() ||
          user.uid === searchTerm
      );

  return (
    <div className="SearchResults">
      <header>
        <p className="small grey">Search results:</p>
      </header>

      {usersFromSearch && usersFromSearch.length ? (
        usersFromSearch.map((user) => (
          <SearchResultsTab
            key={user.uid}
            name={user.name}
            profileURL={user.profileURL}
            handleClick={() => handleSearchResultsTabClick(user.uid)}
          />
        ))
      ) : (
        <p style={{ textAlign: 'center' }}>No user found</p>
      )}
    </div>
  );
}

export default SearchResults;
