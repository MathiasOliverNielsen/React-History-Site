import { useEffect, useState } from 'react';
import styles from './BackToTop.module.scss';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      className={styles.backToTop}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/df4e6267e419cef6f5a4efd0007eef811ca8674b?width=118"
        alt="Back to top"
        width={59}
        height={59}
      />
    </button>
  );
}
