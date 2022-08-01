import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/router';
import styles from './video.module.css';
import { Like, DisLike } from '../../components/icons';
import classnames from 'classnames';
import { getVideoById } from '../../lib/videos';

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
  const id = context.params.id;
  let video = await getVideoById(id);

  return {
    props: {
      video,
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ'];
  const paths = listOfVideos.map((id) => ({
    params: { id },
  }));

  return { paths, fallback: 'blocking' };
}

const Video = ({ video }) => {
  const router = useRouter();
  const [favorited, setFavorited] = useState(0); //1 : dislike   2: like
  const [likeSelected, setLikeSelected] = useState(false);
  const [dislikeSelected, setDislikeSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('funtional component', { video });
  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect(() => {
    const getStats = async (videoId) => {
      let stats = await fetch(`/api/stats?videoId=${videoId}`);
      stats = await stats.json();

      setFavorited(stats.favorited);
      if (stats.favorited === 1) {
        setDislikeSelected(true);
      } else if (stats.favorited === 2) {
        setLikeSelected(true);
      }
      setLoading(false);
    };
    getStats(video.id);
  }, []);

  const handleToggleDislike = async () => {
    setFavorited(1);
    setLikeSelected(false);
    setDislikeSelected(true);
    await rateVideo(1, video.id);
  };

  const handleToggleLike = async () => {
    setFavorited(2);
    setLikeSelected(true);
    setDislikeSelected(false);
    await rateVideo(2, video.id);
  };

  const rateVideo = async (favorited, videoId) => {
    try {
      let res = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          favorited,
          watched: true,
        }),
      });
      res = await res.json();
    } catch (err) {
      console.log(`Error while rating the video.`);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p> Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => {}}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="player"
          type="text/html"
          className={styles.videoPlayer}
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${router.query.id}?enablejsapi=1&origin=http://example.com&controls=0&rel=1`}
          frameBorder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={likeSelected} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={dislikeSelected} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={classnames(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={classnames(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
