import { Navigate, useParams } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageHeader from '../components/PageHeader/PageHeader';
import ChatInput from '../components/ChatInput/ChatInput';

const ChatPage = () => {
  const [user, loading] = useAuthState(auth);
  const params = useParams();
  const chatId = params.chatId;

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user) {
    return (
      <div>
        <PageHeader>
          <h1>Chat page</h1>
        </PageHeader>

        <ChatInput />
      </div>
    );
  }
};

export default ChatPage;
