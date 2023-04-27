import { Navigate, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { auth } from '../firebase';
import ChatRoom from '../components/ChatRoom';
import { getUserIds } from '../utils';

function Chat() {
  const params = useParams();
  const chatId = params.chatId;

  const [user] = useAuthState(auth);

  if (user) {
    if (!getUserIds(chatId).includes(user.uid)) {
      return <Navigate to="/" replace />;
    }

    return (
      <Layout>
        <Sidebar userId={user.uid} currentChat={chatId} />

        <ChatRoom chatId={chatId} />
      </Layout>
    );
  }
}

export default Chat;
