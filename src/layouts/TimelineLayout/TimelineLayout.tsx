import { type ReactNode } from "react";
import styles from "./TimelineLayout.module.scss";

interface TimelineLayoutProps {
  children: ReactNode;
}

export function TimelineLayout({ children }: TimelineLayoutProps) {
  return (
    <div className={styles.timeline}>
      <div className={styles.spine} />
      <div className={styles.spineTop} />
      <div className={styles.items}>{children}</div>
      <div className={styles.footer}>
        <p className={styles.scrollText}>Scroll down for more</p>
        <svg className={styles.arrow} height="63" viewBox="0 0 2 63" fill="none">
          <path
            d="M-1.41421 64.4142C-0.633165 65.1953 0.633165 65.1953 1.41421 64.4142L14.1421 51.6863C14.9232 50.9052 14.9232 49.6389 14.1421 48.8579C13.3611 48.0768 12.0948 48.0768 11.3137 48.8579L0 60.1716L-11.3137 48.8579C-12.0948 48.0768 -13.3611 48.0768 -14.1421 48.8579C-14.9232 49.6389 -14.9232 50.9052 -14.1421 51.6863L-1.41421 64.4142ZM0 0L-2 0L-2 63H0H2L2 0L0 0Z"
            fill="var(--accent)"
          />
        </svg>
      </div>
    </div>
  );
}
