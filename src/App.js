import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout/Layout';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                {user && <Sidebar />}
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/chats/:chatId"
            element={
              <Layout>
                {user && <Sidebar />}
                <ChatPage />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                {user && <Sidebar />}
                <SettingsPage />
              </Layout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
