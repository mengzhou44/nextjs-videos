import Card from './card';
import styles from './section-cards.module.css';

const SectionCards = ({ title, videos = [], size }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, index) => (
          <Card imgUrl={video.imgUrl} key={index} size={size} id={index} />
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
