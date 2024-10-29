import React, { useState } from 'react';
import {
  LoginContainer,
  LoginHeading,
  LoginForm,
  Logo,
  LogBut,
  LoginSentance,
} from './styles';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSpring, animated, useTransition } from '@react-spring/web';
import signInGoogle from './Images/GoogleSignIn.png';

function Login({ onLogin }) {
  const [shake, setShake] = useState(false);
  const [fade, setFade] = useState(false);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const shakeStyle = useSpring({
    from: { transform: 'translateX(0px)' },
    to: async (next, cancel) => {
      if (shake) {
        await next({ transform: 'translateX(-5px)', config: { duration: 50 } });
        await next({ transform: 'translateX(5px)', config: { duration: 50 } });
        await next({ transform: 'translateX(-5px)', config: { duration: 50 } });
        await next({ transform: 'translateX(5px)', config: { duration: 50 } });
        await next({ transform: 'translateX(0px)', config: { duration: 50 } });
        setShake(false);
      }
    },
  });

  const fadeStyle = useSpring({
    opacity: fade ? 0 : 1,
    config: { duration: 500 }
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    signInWithPopup(auth, provider) 
    .then(async (result) => {

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const username = result.user.email;

      console.log('Login successful!');

      let parts = username.split('@');
      let namePart = parts[0];
      let capital_Name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        
      setFade(true);
      setTimeout(() => {
        onLogin(capital_Name);
      }, 850);

    }).catch((error) => {
      setShake(true);
      console.log(error.message);
    });
  };

  return (
    <animated.div style={{ ...shakeStyle, ...fadeStyle }}>
      <LoginContainer>
        <Logo>
          <img src="propal_logo.jpg" alt="Logo" style={{ height: '120px', width: '130px', marginRight: '10px', borderRadius: 20 }} />
        </Logo>
        <LoginHeading>ProcrastiPal</LoginHeading>
        <LoginHeading></LoginHeading>
        <LoginSentance>Sign In: <br></br>
          (Google Account)
        </LoginSentance>
        <LoginForm onSubmit={handleLogin}>
          <LogBut onSubmit={handleLogin}>
            <img type="submit" src={signInGoogle} alt="GoogleSignIn" style={{ height: '90%', width: '40%', borderRadius: 20 }} />
          </LogBut>
        </LoginForm>
      </LoginContainer>
    </animated.div>
  );
}

export default Login;
