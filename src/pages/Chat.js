import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { auth } from '../firebase';
import ChatRoom from '../components/ChatRoom';

function Chat() {
  const params = useParams();
  const chatId = params.chatId;

  const [user, loading] = useAuthState(auth);

  if (user) {
    return (
      <Layout>
        <Sidebar userId={user.uid} currentChat={chatId} />

        <ChatRoom currentChat={chatId} />
      </Layout>
    );
  }
}

export default Chat;
