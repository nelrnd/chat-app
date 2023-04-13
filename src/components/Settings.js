import Avatar from './Avatar';

import { ReactComponent as EditIcon } from '../assets/icons/edit.svg';
import { ReactComponent as CopyIcon } from '../assets/icons/clipboard.svg';

import '../styles/Settings.css';

function Settings() {
  return (
    <div className="Settings">
      <header>
        <h2 className="large">Settings</h2>
      </header>

      <section>
        <div>
          <Avatar
            size={100}
            imageUrl="https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg"
          />

          <div>
            <h3>Mitchell Santana</h3>
            <p className="grey">mitchell.santana@email.comt</p>
          </div>
        </div>

        <button className="small">
          <EditIcon />
          Edit
        </button>
      </section>

      <section>
        <div>
          <p className="grey">This is how people can find you:</p>
          <h3>8904139966</h3>
        </div>

        <button className="small">
          <CopyIcon />
          Copy
        </button>
      </section>
    </div>
  );
}

export default Settings;
