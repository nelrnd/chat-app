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
import { getChatId, getUsersId } from './utils';

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

async function checkIfDocExists(docRef) {
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

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
  const userRef = doc(db, 'users', user.uid);

  if (await checkIfDocExists(userRef)) return;

  await setDoc(userRef, {
    name: user.displayName,
    email: user.email,
    profileURL: user.photoURL,
    uid: user.uid,
    chats: [],
  });
}

export async function createNewChatDocument(users) {
  const chatId = getChatId(users);
  const chatRef = doc(db, 'chats', chatId);

  if ((await checkIfDocExists(chatRef)) === false) {
    await setDoc(chatRef, {
      members: users,
      messages: [],
    });
  }

  return chatId;
}

export async function createChatRefForUsers(users) {
  const chatId = getChatId(users);

  const createChatRef = async (user) => {
    const otherUserUid = users.find((u) => u !== user);
    const otherUserSnap = await getDoc(doc(db, 'users', otherUserUid));

    await updateDoc(doc(db, 'users', user), {
      chats: arrayUnion({
        id: chatId,
        name: otherUserSnap.data().name,
        profileURL: otherUserSnap.data().profileURL,
        lastMessage: null,
      }),
    });
  };

  users.forEach(createChatRef);
}

export async function addChatMessage(chatId, messageInput) {
  const chatRef = doc(db, 'chats', chatId);

  const message = {
    content: messageInput,
    from: auth.currentUser.uid,
    date: Date.now(),
  };

  await updateDoc(chatRef, {
    messages: arrayUnion(message),
  });

  return message;
}

export async function updateLastMessage(chatId, message) {
  const users = getUsersId(chatId);

  const update = async (user) => {
    const userRef = doc(db, 'users', user);
    const userSnap = await getDoc(userRef);
    const chats = userSnap.data().chats;
    chats.find((chat) => chat.id === chatId).lastMessage = {
      content: message.content,
      date: message.date,
    };
    await updateDoc(userRef, {
      chats: chats,
    });
  };

  users.forEach(update);
}
