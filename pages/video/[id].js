import Modal from 'react-modal';
import { useRouter } from 'next/router';
import styles from '../../styles/video.module.css';
import { getVideoById } from '../../lib/videos';
import classnames from 'classnames';

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
  const id = context.params.id;
  const video = await getVideoById(id);

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

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

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
          src={`http://www.youtube.com/embed/${router.query.id}?enablejsapi=1&origin=http://example.com&controls=0&rel=1`}
          frameborder="0"
        ></iframe>

        {/* <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div> */}
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
