import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './login.module.css';
import { useState, useEffect } from 'react';
import validator from 'email-validator';
import { magic } from '../utils/magic-client';
import { setLoginInfo } from '../utils/login-info';

const Login = () => {
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      setIsSigning(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteChange);
    };
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsSigning(true);
      const didToken = await magic.auth.loginWithMagicLink({ email });
      if (didToken) {
        let res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${didToken}`,
          },
        });
        res = await res.json();
        if (res.done) {
          setLoginInfo(email);
          router.push('/');
        } else {
          console.log('something went wrong!');
          setIsSigning(false);
        }
      }
    } catch (err) {
      console.error(err);
      setIsSigning(false);
    }
  };

  const handleTextChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value !== '' && !validator.validate(e.target.value)) {
      setUserMessage('Enter valid email address!');
    } else {
      setUserMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix login page</title>
      </Head>
      <header className={styles.header}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="128px"
                height="34px"
              />
            </div>
          </a>
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Sign In</h1>
        <input
          className={styles.txtEmail}
          type="text"
          placeholder="Email address"
          value={email}
          onChange={handleTextChange}
        ></input>
        <p>{userMessage}</p>
        <button className={styles.btnLogin} onClick={handleLogin}>
          {isSigning ? 'Signing ...' : 'Sign in'}
        </button>
      </main>
    </div>
  );
};

export default Login;
