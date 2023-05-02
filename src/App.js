import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import ComponentsDisplay from './components/ComponentDisplay';
import Sidebar from './components/Sidebar/Sidebar';

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
      <Sidebar />
    </div>
  );
}

export default App;
