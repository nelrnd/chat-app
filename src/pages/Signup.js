import { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import JoinLayout from '../components/JoinLayout';
import Separator from '../components/Separator';

import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg';
import { ReactComponent as BackIcon } from '../assets/icons/back.svg';

function Signup() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const [currentStep, setCurrentStep] = useState(1);

  const [user] = useAuthState(auth);

  const handleEmailChange = (event) => setUserEmail(event.target.value);
  const handleNameChange = (event) => setUserName(event.target.value);
  const handlePwdChange = (event) => setUserPwd(event.target.value);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, userEmail, userPwd)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.error(`${error.code}: ${error.message}`);
      });
  };

  const goNextStep = () => setCurrentStep(currentStep + 1);
  const goPrevStep = () => setCurrentStep(currentStep - 1);

  if (user) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <JoinLayout>
        <form onSubmit={handleFormSubmit}>
          {currentStep === 1 && (
            <EnterEmailSection
              userEmail={userEmail}
              handleEmailChange={handleEmailChange}
              goNextStep={goNextStep}
            />
          )}
          {currentStep === 2 && (
            <CreateAccountSection
              userEmail={userEmail}
              userName={userName}
              userPwd={userPwd}
              handleNameChange={handleNameChange}
              handlePwdChange={handlePwdChange}
              goPrevStep={goPrevStep}
            />
          )}
        </form>
      </JoinLayout>
    );
  }
}

function EnterEmailSection({ userEmail, handleEmailChange, goNextStep }) {
  const emailInput = useRef(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(emailInput.current && emailInput.current.checkValidity());
  }, [userEmail]);

  return (
    <>
      <h1 className="large">Sign up</h1>

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
          ref={emailInput}
        />
      </div>

      <button
        className="primary full-width"
        type="button"
        onClick={goNextStep}
        disabled={!isEmailValid}
      >
        Continue
      </button>

      <Separator />

      <button
        className="google-btn full-width"
        type="button"
        onClick={signInWithGoogle}
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <p className="small grey">
        You already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  );
}

function CreateAccountSection({
  userEmail,
  userName,
  userPwd,
  handleNameChange,
  handlePwdChange,
  goPrevStep,
}) {
  return (
    <>
      <button className="icon-btn" onClick={goPrevStep}>
        <BackIcon />
      </button>

      <h1 className="large">Create an account</h1>

      <div className="row">
        <label htmlFor="email">Email</label>
        <input
          className="outline"
          type="email"
          id="email"
          name="email"
          required
          value={userEmail}
          disabled
        />
      </div>

      <div className="row">
        <label htmlFor="name">Name</label>
        <input
          className="outline"
          type="text"
          id="name"
          name="name"
          required
          value={userName}
          onChange={handleNameChange}
        />
      </div>

      <div className="row">
        <label htmlFor="pwd">Password</label>
        <input
          className="outline"
          type="password"
          id="pwd"
          name="password"
          required
          minLength="6"
          value={userPwd}
          onChange={handlePwdChange}
        />
      </div>

      <button className="primary full-width">Sign up</button>
    </>
  );
}

export default Signup;
