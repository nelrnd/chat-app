import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getChatId, getUserIds } from './utils';

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
export const storage = getStorage();

async function checkIfDocExists(docRef) {
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export function getOtherUserId(chatId) {
  const users = getUserIds(chatId);
  return users.find((user) => user !== auth.currentUser.uid);
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await createUser(auth.currentUser);
  } catch (err) {
    console.error(err);
  }
}

// Create user document in Firestore
export async function createUser(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    if (await checkIfDocExists(userRef)) return;
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      profileURL: user.photoURL,
      chats: [],
    });
  } catch (err) {
    console.error(err);
  }
}

export async function updateUserInfo(user, updatedInfo) {
  try {
    // update info in Auth
    await updateProfile(user, updatedInfo);
    // update info in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      name: user.displayName,
      email: user.email,
      profileURL: user.photoURL,
    });
  } catch (err) {
    console.error(err);
  }
}

// Create chat document in Firestore
export async function createChat(userIds) {
  try {
    const chatId = getChatId(userIds);
    const chatRef = doc(db, 'chats', chatId);
    await setDoc(chatRef, {
      members: [...userIds],
      messages: [],
      lastMessage: { text: null, date: null },
      id: chatId,
      unreadCount: {
        [userIds[0]]: 0,
        [userIds[1]]: 0,
      },
    });
    return chatId;
  } catch (err) {
    console.error(err);
  }
}

// Create a chat reference for each user's document in Firestore
export async function createChatRefs(userIds, chatId) {
  try {
    const createRef = async (userId) => {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        chats: arrayUnion(chatId),
      });
    };
    userIds.forEach(createRef);
  } catch (err) {
    console.error(err);
  }
}

export async function createChatMessage(chatId, messageText) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const message = {
      text: messageText,
      from: auth.currentUser.uid,
      date: Date.now(),
    };
    await updateDoc(chatRef, {
      messages: arrayUnion(message),
    });
    return message;
  } catch (err) {
    console.error(err);
  }
}

export async function updateLastChatMessage(chatId, senderId, message) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: {
        text: message.text,
        date: message.date,
        read: {
          [senderId]: true,
          [getOtherUserId(chatId)]: false,
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
}

export async function updateUnreadCount(chatId) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();
    for (let user in chatData.unreadCount) {
      if (!chatData.lastMessage.read[user]) {
        chatData.unreadCount[user]++;
      }
    }
    await updateDoc(chatRef, {
      unreadCount: chatData.unreadCount,
    });
  } catch (err) {
    console.error(err);
  }
}
