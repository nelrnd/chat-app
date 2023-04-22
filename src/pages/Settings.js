import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';

import { ReactComponent as EditIcon } from '../assets/icons/edit.svg';
import { ReactComponent as CopyIcon } from '../assets/icons/clipboard.svg';
import Layout from '../components/Layout';

function Settings() {
  const [user, loading] = useAuthState(auth);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  } else if (user) {
    return (
      <Layout>
        <Sidebar userId={user.uid} />

        <div>
          <header className="page-bar">
            <h2 className="large single-line">Settings</h2>
          </header>

          <section className="page-section">
            <div className="row">
              <Avatar imageURL={user.photoURL} size="large" />
              <div>
                <h3>{user.displayName}</h3>
                <p className="grey">{user.email}</p>
              </div>
            </div>

            <button className="secondary small">
              <EditIcon />
              EDIT
            </button>
          </section>

          <section className="page-section">
            <div>
              <p className="grey">This is how people can find you:</p>
              <h3>{user.uid}</h3>
            </div>

            <button className="secondary small">
              <CopyIcon />
              COPY
            </button>
          </section>
        </div>
      </Layout>
    );
  }
}

export default Settings;
