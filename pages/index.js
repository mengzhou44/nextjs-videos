import Head from 'next/head';
import Banner from '../components/banner';
import Navbar from '../components/navbar';
import styles from '../styles/Home.module.css';
import { getPopularVideos, getVideos } from '../lib/videos';

import SectionCards from '../components/card/section-cards';

export async function getServerSideProps(context) {
  const disneyVideos = await getVideos('disney trailer');
  const travelVideos = await getVideos('travel');
  const productivityVideos = await getVideos('productivity');

  const popularVideos = await getPopularVideos();

  return {
    props: {
      disneyVideos,
      travelVideos,
      popularVideos,
      productivityVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  popularVideos,
  productivityVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix App</title>
        <meta name="description" content="Netflix App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar  />
      <Banner
        videoId="4zH5iYM4wJo"
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
        <SectionCards title="Travel" videos={travelVideos} size="small" />
        <SectionCards
          title="Productivity"
          videos={productivityVideos}
          size="medium"
        />
        <SectionCards title="Popular" videos={popularVideos} size="small" />
      </div>
    </div>
  );
}
