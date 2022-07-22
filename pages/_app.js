import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { magic } from '../lib/magic-client';
import '../styles/globals.css';

import Loading from '../components/loading';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function isLoggedIn() {
      let res = await magic.user.isLoggedIn();
      if (res) {
        router.push('/');
      } else {
        router.push('/login');
      }
    }
    isLoggedIn();
  },[]);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
