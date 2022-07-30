import Head from 'next/head';
import Navbar from '../components/navbar';
import styles from '../styles/my-list.module.css';
import SectionCards from '../components/card/section-cards';
import { getMyVideos } from '../lib/db/hasura';
import { useRedirect } from '../lib/useRedirect';

export async function getServerSideProps(context) {
  const { token, userId } = await useRedirect(context);

  let myVideos = await getMyVideos(token, userId);
 
  myVideos =
    myVideos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || [];

  return {
    props: {
      myVideos,
    },
  };
}

export default function MyList({ myVideos }) {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
}
