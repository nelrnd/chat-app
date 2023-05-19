import { collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export default function useMembersData(ids) {
  const usersCollection = collection(db, 'users');
  const membersQuery = ids && query(usersCollection, where('id', 'in', ids));
  const [members, loading] = useCollectionData(membersQuery);
  return [members, loading];
}
