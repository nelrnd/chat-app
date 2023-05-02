import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import LoginPage from './pages/LoginPage/LoginPage';

/*
function App() {
  return (
    <div className="App">
      <ComponentsDisplay />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats/:chatId" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
*/

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
