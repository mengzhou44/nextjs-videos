import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './card.module.css';
import classnames from 'classnames';
import Link from 'next/link';

const defaultImgUrl =
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80';

const Card = ({ imgUrl = defaultImgUrl, size = 'medium', id = 0, videoId }) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleError = () => {
    setImgSrc(defaultImgUrl);
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  return (
    <motion.div
      className={classnames(classMap[size], styles.imgMotionWrapper)}
      whileHover={scale}
    >
      <Link href={`/video/${videoId}`}>
        <a>
          <Image
            src={imgSrc}
            alt="image"
            layout="fill"
            className={styles.cardImg}
            onError={handleError}
          ></Image>
        </a>
      </Link>
    </motion.div>
  );
};

export default Card;
