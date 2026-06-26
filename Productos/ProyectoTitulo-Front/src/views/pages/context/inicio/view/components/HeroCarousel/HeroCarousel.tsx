import { useState, useEffect } from 'react';
import styles from './HeroCarousel.module.css';

const INTERVAL = 10000;

export default function HeroCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className={styles.carousel}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
        />
      ))}

      <div className={styles.overlay} />

      <div className={styles.dots}>
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
