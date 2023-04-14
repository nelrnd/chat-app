import { useState } from 'react';

import JoinLayout from '../components/JoinLayout';
import Separator from '../components/Separator';

import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg';

function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const handleEmailChange = (event) => setUserEmail(event.target.value);
  const handlePwdChange = (event) => setUserPwd(event.target.value);

  return (
    <JoinLayout>
      <form>
        <h1 className="large">Log in</h1>

        <div className="row">
          <label htmlFor="email">Email</label>
          <input
            className="outline"
            type="email"
            id="email"
            name="email"
            required
            value={userEmail}
            onChange={handleEmailChange}
          />
        </div>

        <div className="row">
          <label htmlFor="password">Password</label>
          <input
            className="outline"
            type="password"
            id="password"
            name="password"
            required
            value={userPwd}
            onChange={handlePwdChange}
          />
        </div>

        <button type="submit" className="primary full-width">
          Log in
        </button>

        <Separator />

        <button className="google-btn full-width" type="button">
          <GoogleIcon />
          Log in with Google
        </button>

        <p className="small grey">
          You don't have an account? <a href="/">Sign up</a>
        </p>
      </form>
    </JoinLayout>
  );
}

export default Login;
