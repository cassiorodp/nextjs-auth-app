import axios from 'axios';
import { useState } from 'react';
import classes from './auth-form.module.css';
import { signIn } from 'next-auth/client';

async function createUser(userCredential) {
  const { email, password } = userCredential;
  try {
    const response = await axios.post('/api/auth/signup', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Something went wrong!');
  }
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  function inputHandler(event) {
    const { value, name } = event.target;

    setUserCredentials((prevState) => ({ ...prevState, [name]: value }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        ...userCredentials,
      });

      console.log(result);
    } else {
      try {
        const result = await createUser(userCredentials);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            value={userCredentials.email}
            onChange={inputHandler}
            name="email"
            type="email"
            id="email"
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            value={userCredentials.password}
            onChange={inputHandler}
            name="password"
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
