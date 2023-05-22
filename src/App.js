import { useState } from 'react';
import { ThemeContext } from './contexts/theme-context';
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
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout theme={theme}>
                  {user && <Sidebar userId={user.uid} />}
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/chats/:chatId"
              element={
                <Layout theme={theme}>
                  {user && <Sidebar userId={user.uid} hideOnSmall={true} />}
                  <ChatPage />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout theme={theme}>
                  {user && <Sidebar userId={user.uid} hideOnSmall={true} />}
                  <SettingsPage />
                </Layout>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
