import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, createUser, signInWithGoogle } from '../firebase';
import { Link, Navigate } from 'react-router-dom';
import { validateEmail } from '../utils';
import JoinLayout from '../components/JoinLayout/JoinLayout';
import TextInput from '../components/TextInput/TextInput';
import Button from '../components/Button/Button';
import Divider from '../components/Divider/Divider';
import GoogleButton from '../components/Button/GoogleButton';
import IconButton from '../components/IconButton/IconButton';
import Icon from '../components/Icon/Icon';
import { useAuthState } from 'react-firebase-hooks/auth';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState(null);
  const [user] = useAuthState(auth);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePwdChange = (e) => setPwd(e.target.value);

  const [currentSection, setCurrentSection] = useState(1);

  const goNextSection = () => setCurrentSection(currentSection + 1);
  const goPrevSection = () => setCurrentSection(currentSection - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, pwd);
      await updateProfile(auth.currentUser, { displayName: name });
      await createUser(auth.currentUser);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        const errText = 'A user with that email already exists';
        const alertIcon = <Icon name="alert" />;
        const errMsg = (
          <p className="err-msg">
            {alertIcon}
            {errText}
          </p>
        );
        setErrMsg(errMsg);
      }
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <JoinLayout>
        <form onSubmit={handleSubmit}>
          {currentSection === 1 && (
            <EnterEmailSection
              goNextSection={goNextSection}
              email={email}
              handleEmailChange={handleEmailChange}
            />
          )}
          {currentSection === 2 && (
            <CreateAccountSection
              goPrevSection={goPrevSection}
              email={email}
              name={name}
              handleNameChange={handleNameChange}
              pwd={pwd}
              handlePwdChange={handlePwdChange}
              errMsg={errMsg}
            />
          )}
        </form>
      </JoinLayout>
    );
  }
};

const EnterEmailSection = ({ goNextSection, email, handleEmailChange }) => {
  const [emailIsValid, setEmailIsValid] = useState(false);

  useEffect(() => {
    setEmailIsValid(validateEmail(email));
  }, [email]);

  return (
    <>
      <h1>Sign up</h1>

      <TextInput
        label="Email"
        id="email"
        value={email}
        handleChange={handleEmailChange}
      />
      <Button size="large" handleClick={goNextSection} disabled={!emailIsValid}>
        Continue
      </Button>

      <Divider />

      <GoogleButton text="Sign up with Google" handleClick={signInWithGoogle} />

      <p className="sml-txt grey">
        You already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  );
};

const CreateAccountSection = ({
  goPrevSection,
  email,
  name,
  handleNameChange,
  pwd,
  handlePwdChange,
  errMsg,
}) => {
  return (
    <>
      <IconButton name="back" handleClick={goPrevSection} />

      <h1>Create account</h1>

      <TextInput
        type="email"
        label="Email"
        id="email"
        value={email}
        disabled={true}
        required={true}
      />
      <TextInput
        label="Name"
        id="name"
        value={name}
        handleChange={handleNameChange}
        required={true}
        minLength="2"
      />
      <TextInput
        type="password"
        label="Password"
        id="pwd"
        value={pwd}
        handleChange={handlePwdChange}
        required={true}
        minLength="6"
      />

      {errMsg}

      <Button size="large">Sign up</Button>
    </>
  );
};

export default SignupPage;
