import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function useUserData(uid) {
  const userRef = doc(db, 'users', uid);
  const [user, loading] = useDocumentData(userRef);
  return [user, loading];
}
