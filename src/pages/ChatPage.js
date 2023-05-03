import { Navigate, useParams } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageHeader from '../components/PageHeader/PageHeader';
import ChatInput from '../components/ChatInput/ChatInput';
import useChatData from '../hooks/useChatData';
import Message from '../components/Message/Message';

const ChatPage = () => {
  const [user, loading] = useAuthState(auth);
  const params = useParams();
  const chatId = params.chatId;
  const [chatData] = useChatData(chatId);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user) {
    return (
      <div>
        <PageHeader>
          <h1>Chat page</h1>
        </PageHeader>

        <main>
          {chatData &&
            chatData.messages.map((msg) => (
              <Message key={msg.date} text={msg.text} />
            ))}
        </main>

        <ChatInput />
      </div>
    );
  }
};

export default ChatPage;
