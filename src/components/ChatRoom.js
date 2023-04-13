import Message from './Message';

import '../styles/ChatRoom.css';

function ChatRoom() {
  return (
    <div className="ChatRoom">
      <header>
        <h2 className="large">Aubrey</h2>
      </header>

      <section className="messages">
        <Message
          text={'Tuesday is fine for me. Where you want to meet?'}
          date={'10:32AM'}
        />
        <Message text={'Restaurant or bar?'} date={'10:32AM'} isSent={true} />
        <Message text={'I think a bar would be great'} date={'10:32AM'} />
        <Message text={'Is that ok for you?'} date={'10:32AM'} />
        <Message text={'Sure!'} date={'10:32AM'} isSent={true} />
        <Message text={'Perfect!'} date={'10:32AM'} />
        <Message text={'Do you have a place suggestion?'} date={'10:32AM'} />
        <Message
          text={'I propose Saint Ronavland bar'}
          date={'10:32AM'}
          isSent={true}
        />
        <Message text={'Sounds great to me'} date={'10:32AM'} />
        <Message text={'Are you arrived yet?'} date={'10:32AM'} isSent={true} />
        <Message text={'I’ll be there in 2 mins'} date={'10:32AM'} />
      </section>

      <section className="bottom">
        <form action="#">
          <input type="text" placeholder="Type in something..." />
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}

export default ChatRoom;
