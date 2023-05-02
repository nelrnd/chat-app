import { useState } from 'react';
import { auth, signInWithGoogle } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import JoinLayout from '../components/JoinLayout/JoinLayout';
import TextInput from '../components/TextInput/TextInput';
import Button from '../components/Button/Button';
import Divider from '../components/Divider/Divider';
import GoogleButton from '../components/Button/GoogleButton';
import Icon from '../components/Icon/Icon';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePwdChange = (e) => setPwd(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        const errText = 'Invalid email or password';
        const alertIcon = <Icon name="alert" />;
        const errMsg = (
          <div className="err-msg">
            {alertIcon}
            {errText}
          </div>
        );
        setErrMsg(errMsg);
      }
    }
  };

  return (
    <JoinLayout>
      <form onSubmit={handleSubmit}>
        <h1>Log in</h1>

        <TextInput
          type="email"
          label="Email"
          id="email"
          value={email}
          handleChange={handleEmailChange}
          required={true}
        />
        <TextInput
          type="password"
          label="Password"
          id="password"
          value={pwd}
          handleChange={handlePwdChange}
          required={true}
        />

        {errMsg}

        <Button size="large">Log in</Button>

        <Divider />

        <GoogleButton
          text="Log in with Google"
          handleClick={signInWithGoogle}
        />

        <p className="sml-txt grey">
          You don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </JoinLayout>
  );
};

export default LoginPage;
