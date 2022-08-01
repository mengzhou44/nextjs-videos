import Head from 'next/head';
import Banner from '../components/banner';
import Navbar from '../components/navbar';
import styles from './index.module.css';
import { getPopularVideos, getVideos } from '../lib/videos';

import SectionCards from '../components/card/section-cards';
import { getWatchedVideos } from '../lib/db/hasura';
import { redirectUser } from '../lib/redirect-user';

export async function getServerSideProps(context) {
  const { token, userId } = await redirectUser(context);
 
  let watchAgainVideos = await getWatchedVideos(token, userId);
  watchAgainVideos =
    watchAgainVideos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || [];

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
      watchAgainVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  popularVideos,
  productivityVideos,
  watchAgainVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix App</title>
        <meta name="description" content="Netflix App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Banner
        videoId="4zH5iYM4wJo"
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
        <SectionCards
          title="Watch it again"
          videos={watchAgainVideos}
          size="small"
        />

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
