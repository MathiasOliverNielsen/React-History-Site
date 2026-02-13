import type { TimelineEvent } from "../../api/types";
import styles from "./TimelineItem.module.scss";

interface TimelineItemProps {
  event: TimelineEvent;
  side: "left" | "right";
}

export function TimelineItem({ event, side }: TimelineItemProps) {
  const itemClass = `${styles.item} ${side === "left" ? styles.left : styles.right}`;

  return (
    <div className={itemClass}>
      {/* Connecting line from dot to content */}
      <div className={styles.line} />

      {/* Dot on spine */}
      <div className={styles.spine}>
        <div className={styles.dot} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.textBlock}>
          {/* Show date if available (for ByDate page) */}
          {event.eventDate && <div className={styles.date}>{event.eventDate.toLocaleDateString()}</div>}
          <div className={styles.year}>YEAR: {event.year}</div>
          <div className={styles.text}>{event.text}</div>
          {event.wikipediaUrl && (
            <a href={event.wikipediaUrl} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M9 9h6v6" />
              </svg>
              Read more
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
