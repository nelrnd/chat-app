import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function useChatData(chatId) {
  const chatRef = doc(db, 'chats', chatId);
  const [chatData, loading] = useDocumentData(chatRef);
  return [chatData, loading];
}
