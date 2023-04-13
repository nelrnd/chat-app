import '../styles/ChatRoom.css';

function ChatRoom() {
  return (
    <div className="ChatRoom">
      <header>
        <h2 className="large">Aubrey</h2>
      </header>

      <div>Perfect!</div>

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
