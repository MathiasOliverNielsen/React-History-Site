import { Link, useLocation } from "react-router";
import { useState } from "react";
import styles from "./Header.module.scss";

// Create a simple event system for date changes
const dateChangeListeners = new Set<(date: string) => void>();

export const subscribeDateChange = (callback: (date: string) => void) => {
  dateChangeListeners.add(callback);
  return () => {
    dateChangeListeners.delete(callback);
  };
};

const notifyDateChange = (date: string) => {
  dateChangeListeners.forEach((callback) => callback(date));
};

export function Header() {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState("");

  const isActive = (path: string) => location.pathname === path;
  const isDatePage = location.pathname === "/by-date";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;

    // Only proceed if we have a valid date
    if (!dateValue) return;

    setSelectedDate(dateValue);
    notifyDateChange(dateValue);
  };

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

        <h1 className={styles.title}>
          {isDatePage ? (
            <>
              ON THIS <input type="date" value={selectedDate} onChange={handleDateChange} className={styles.inlineDateInput} placeholder="DAY" aria-label="Select date" />
            </>
          ) : (
            "ON THIS DAY"
          )}
        </h1>

        <p className={styles.subtitle}>
          {isDatePage ? "Select a date to discover historical events that happened on that day" : "What happened on this day - historical events, deaths and births thoughout time"}
        </p>

        {/* Remove the separate date input section since it's now inline */}
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
