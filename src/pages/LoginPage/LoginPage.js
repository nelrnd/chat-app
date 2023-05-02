import JoinLayout from '../../components/JoinLayout/JoinLayout';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import Divider from '../../components/Divider/Divider';
import { Link } from 'react-router-dom';
import GoogleButton from '../../components/Button/GoogleButton';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePwdChange = (e) => setPwd(e.target.value);

  return (
    <JoinLayout>
      <form>
        <h1>Log in</h1>

        <TextInput
          label="email"
          id="email"
          value={email}
          handleChange={handleEmailChange}
        />
        <TextInput
          label="password"
          id="password"
          value={pwd}
          handleChange={handlePwdChange}
        />
        <Button size="large">Log in</Button>

        <Divider />

        <GoogleButton text="Log in with Google" />

        <p className="sml-txt grey">
          You don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </JoinLayout>
  );
};

export default LoginPage;
