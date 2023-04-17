import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await addNewUserToFirestore(auth.currentUser);
  } catch (err) {
    console.error(`${err.code}: ${err.message}`);
  }
}

export async function addNewUserToFirestore(user) {
  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return;
  }
  await setDoc(docRef, {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    uid: user.uid,
    chats: [],
  });
}

export async function createNewChatDocument(uid1, uid2) {
  const docId = uid1 < uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`;
  const docData = {
    members: [uid1, uid2],
    messages: [],
  };
  await setDoc(doc(db, 'chats', docId), docData);
  return docId;
}
