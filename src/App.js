import './App.css';

import ChatTab from './components/ChatTab';

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
      <ChatTab
        name={'Aubrey'}
        lastMessage={{ text: 'Perfect!', date: '16m' }}
        imageUrl="https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg"
        unreadMessages={['ud', 'id']}
      />
    </div>
  );
}

export default App;
