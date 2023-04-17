import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getChatId } from './utils';

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

export async function createNewChatDocument(users) {
  const chatId = getChatId(users);
  const chatRef = doc(db, 'chats', chatId);

  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) return chatId;

  const chatData = {
    members: users,
    messages: [],
  };
  await setDoc(doc(db, 'chats', chatId), chatData);
  return chatId;
}

export async function createChatRefForUsers(users) {
  const chatId = getChatId(users);
  users.forEach(async (user) => {
    // get other user infos
    const uid = users.find((u) => u !== user);
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const docRef = doc(db, 'users', user);
    await updateDoc(docRef, {
      chats: arrayUnion({
        id: chatId,
        displayName: userData.displayName,
        profileUrl: userData.photoURL,
      }),
    });
  });
}

export async function addChatMessage(id, message) {
  const docRef = doc(db, 'chats', id);
  await updateDoc(docRef, {
    messages: arrayUnion({
      content: message,
      from: auth.currentUser.uid,
      date: Date.now(),
    }),
  });
}
