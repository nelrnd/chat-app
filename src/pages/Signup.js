import { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, createUser, signInWithGoogle } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import JoinLayout from '../components/JoinLayout';
import Separator from '../components/Separator';

import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg';
import { ReactComponent as BackIcon } from '../assets/icons/back.svg';

function Signup() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [currentStep, setCurrentStep] = useState(1);

  const [user] = useAuthState(auth);

  const handleEmailChange = (e) => setUserEmail(e.target.value);
  const handleNameChange = (e) => setUserName(e.target.value);
  const handlePwdChange = (e) => setUserPwd(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, userEmail, userPwd);
      await updateProfile(auth.currentUser, { displayName: userName });
      await createUser(auth.currentUser);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        const errorMessage = (
          <p className="error-message small">
            A user with that email already exists
          </p>
        );
        setErrorMessage(errorMessage);
      }
    }
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
              errorMessage={errorMessage}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isEmailValid) {
              e.preventDefault();
              goNextStep();
            }
          }}
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
  errorMessage,
}) {
  return (
    <>
      <button className="icon-btn" onClick={goPrevStep} type="button">
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
          autoFocus
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

      {errorMessage}

      <button className="primary full-width" type="submit">
        Sign up
      </button>
    </>
  );
}

export default Signup;
