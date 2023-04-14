import { useState } from 'react';
import Separator from '../components/Separator';

import '../styles/Login.css';

import Illustration from '../assets/images/people-chatting.svg';
import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg';

function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const handleEmailChange = (event) => setUserEmail(event.target.value);
  const handlePwdChange = (event) => setUserPwd(event.target.value);

  return (
    <div className="Login">
      <div className="grid">
        <div className="img-wrapper">
          <img src={Illustration} alt="people chatting" />
        </div>

        <div className="form-wrapper">
          <form>
            <h1 className="large">Log in</h1>

            <div>
              <label htmlFor="email">Email</label>
              <input
                className="outline"
                type="email"
                id="email"
                name="email"
                value={userEmail}
                onChange={handleEmailChange}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                className="outline"
                type="password"
                id="password"
                name="password"
                value={userPwd}
                onChange={handlePwdChange}
              />
            </div>

            <button type="submit" className="primary full-width">
              Log in
            </button>
          </form>

          <Separator />

          <button className="google-btn full-width">
            <GoogleIcon />
            Log in with Google
          </button>

          <p className="small grey">
            You don't have an account? <a href="/">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
