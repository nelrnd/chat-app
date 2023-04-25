import { collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SearchResultsTab from './SearchResultsTab';

import '../styles/SearchResults.css';

function SearchResults({ searchTerm, handleClick }) {
  const userListRef = collection(db, 'users');
  const [userList, loading] = useCollectionData(userListRef, { idField: 'id' });

  let filteredSearch =
    userList &&
    userList
      .filter((user) => user.id !== auth.currentUser.uid)
      .filter(
        (user) =>
          user.id === searchTerm ||
          user.email.toLowerCase() === searchTerm.toLowerCase()
      );

  return (
    <div className="SearchResults">
      <header>
        <p className="small grey">Search results:</p>
      </header>

      {loading && <p>Loading...</p>}

      {filteredSearch && filteredSearch.length ? (
        filteredSearch.map((user) => (
          <SearchResultsTab
            key={user.id}
            name={user.name}
            profileURL={user.profileURL}
            handleClick={() => handleClick(user.id)}
          />
        ))
      ) : (
        <p style={{ textAlign: 'center' }}>No user found</p>
      )}
    </div>
  );
}

export default SearchResults;
