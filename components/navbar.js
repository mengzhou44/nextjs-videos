import { useEffect, useState } from 'react';
import styles from './navbar.module.css';

import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { magic } from '../lib/magic-client';
import { loginInfo, setLoginInfo, clearLoginInfo } from '../lib/login-info';

const NavBar = ({}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('loading...');
  const router = useRouter();

  useEffect(() => {
    const applyUsernameInNav = async () => {
      try {
        const { email } = await magic.user.getMetadata();

        if (email) {
          setUsername(email);
          setLoginInfo(email);
        } else {
          handleSignout();
        }
      } catch (error) {
        console.error('Error retrieving email', error);
      }
    };
    if (loginInfo === null) {
      applyUsernameInNav();
    } else {
      setUsername(loginInfo.email);
    }
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push('/');
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push('/my-list');
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      await response.json();
      clearLoginInfo();
    } catch (error) {
      console.error('Error logging out', error);
      router.push('/login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              {/** Expand more icon */}
              <Image
                src={'/static/expand_more.svg'}
                alt="Expand dropdown"
                width="24px"
                height="24px"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
