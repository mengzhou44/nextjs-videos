import Head from 'next/head';
import Banner from '../components/banner';
import Navbar from '../components/navbar';
import styles from '../styles/Home.module.css';

import SectionCards from '../components/card/section-cards';

export default function Home() {
  const videos = [
    {
      imgUrl: '/static/clifford.webp',
    },
    {
      imgUrl: '/static/clifford.webp',
    },
    {
      imgUrl: '/static/clifford.webp',
    },
    {
      imgUrl: '/static/clifford.webp',
    },
    {
      imgUrl: '/static/clifford.webp',
    },
  ];
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix App</title>
        <meta name="description" content="Netflix App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar username="mengzhou44@gmail.com" />
      <Banner
        videoId="4zH5iYM4wJo"
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={videos} size="large" />
      </div>
    </div>
  );
}
