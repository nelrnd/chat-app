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
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { createGroupChatId, getChatId, getUserIds } from './utils';

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
      id: user.uid,
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
    const chatId =
      userIds.length === 2 ? getChatId(userIds) : createGroupChatId();
    const chatRef = doc(db, 'chats', chatId);
    if (await checkIfDocExists(chatRef)) return chatId;
    const chatDoc = {
      id: chatId,
      members: [...userIds],
      messages: [],
      lastMessage: { text: null, imageURL: null, date: null, from: null },
      unreadCount: {},
    };
    for (const user of userIds) {
      chatDoc.unreadCount[user] = 0;
    }
    await setDoc(chatRef, chatDoc);
    return chatId;
  } catch (err) {
    console.error(err);
  }
}

// Create a chat reference for each user's document in Firestore
export async function createChatRefs(chatId) {
  try {
    const createRef = async (userId) => {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        chats: arrayUnion(chatId),
      });
    };
    const members = await getChatMembers(chatId);
    members.forEach(createRef);
  } catch (err) {
    console.error(err);
  }
}

export async function createChatMessage(chatId, message) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion(message),
    });
  } catch (err) {
    console.error(err);
  }
}

export async function updateLastChatMessage(chatId, senderId, message) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const lastMessage = {
      text: message.text || '',
      imageURL: message.imageURL || '',
      date: message.date,
      from: senderId,
      read: {},
    };
    const userIds = await getChatMembers(chatId);
    for (const user of userIds) {
      lastMessage.read[user] = user === senderId;
    }
    await updateDoc(chatRef, {
      lastMessage: lastMessage,
    });
  } catch (err) {
    console.error(err);
  }
}

export async function incrementUnreadCount(chatId, userId) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();
    for (const user in chatData.unreadCount) {
      if (user !== userId) {
        chatData.unreadCount[user]++;
      }
    }
    await updateDoc(chatRef, { unreadCount: chatData.unreadCount });
  } catch (err) {
    console.error(err);
  }
}

export async function readLastChatMessage(chatId, userId) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const update = {};
    update[`lastMessage.read.${userId}`] = true;
    update[`unreadCount.${userId}`] = 0;
    await updateDoc(chatRef, update);
  } catch (err) {
    console.error(err);
  }
}

export async function uploadFile(file, path) {
  try {
    const metadata = { contentType: file.type };
    const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    const storageRef = ref(storage, `${path}.${ext}`);

    await uploadBytes(storageRef, file, metadata);
    const fileURL = await getDownloadURL(storageRef);
    return fileURL;
  } catch (err) {
    console.error(err);
  }
}

export async function uploadImage(imageFile, userId) {
  try {
    const path = `/images/${userId}/${Date.now()}`;
    const imageURL = await uploadFile(imageFile, path);
    return imageURL;
  } catch (err) {
    console.error(err);
  }
}

export async function uploadProfileImage(imageFile, userId) {
  try {
    const path = `/profiles/${userId}`;
    const imageURL = await uploadFile(imageFile, path);
    return imageURL;
  } catch (err) {
    console.error(err);
  }
}

export async function getChatData(chatId) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();
    return chatData;
  } catch (err) {
    console.error(err);
  }
}

export async function getChatMembers(chatId) {
  try {
    const chatData = await getChatData(chatId);
    return chatData.members;
  } catch (err) {
    console.error(err);
  }
}

export async function getOtherChatMembers(members, userId) {
  try {
    return members.filter((member) => member !== userId);
  } catch (err) {
    console.error(err);
  }
}
