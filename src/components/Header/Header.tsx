import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.heroImage}>
        <img src="https://api.builder.io/api/v1/image/assets/TEMP/fe2c9bffa4be1e860bfb6e9cefa12e4a0af6fde1?width=2880" alt="Historical background" />
        <div className={styles.overlay} />
      </div>

      <div className={styles.card}>
        <div className={styles.cornerDot} data-position="top-left" />
        <div className={styles.cornerDot} data-position="top-right" />
        <div className={styles.cornerDot} data-position="bottom-left" />
        <div className={styles.cornerDot} data-position="bottom-right" />

        <h1 className={styles.title}>ON THIS DAY</h1>
        <p className={styles.subtitle}>What happened on this day - historical events, deaths and births thoughout time</p>
      </div>

      <nav className={styles.nav}>
        <Link to="/by-date" className={isActive("/by-date") ? styles.active : ""}>
          BY DATE
        </Link>
        <Link to="/" className={isActive("/") ? styles.active : ""}>
          TODAY
        </Link>
        <Link to="/since" className={isActive("/since") ? styles.active : ""}>
          SINCE
        </Link>
      </nav>

      <div className={styles.divider} />
    </header>
  );
}
