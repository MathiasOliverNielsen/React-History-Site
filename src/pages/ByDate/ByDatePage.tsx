import { useEffect, useState } from "react";
import { PageLayout } from "../../layouts/PageLayout";
import { TimelineLayout } from "../../layouts/TimelineLayout";
import { TimelineItem } from "../../components/TimelineItem";
import { fetchByDate } from "../../api/history";
import type { TimelineEvent } from "../../api/types";
import styles from "./ByDatePage.module.scss";

export function ByDatePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadMore, setLoadMore] = useState(10);

  const loadEvents = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchByDate(date);
      setEvents(data);
      setDisplayedEvents(data.slice(0, 10));
      setLoadMore(10);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error(err);
      setEvents([]);
      setDisplayedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);

    if (dateValue) {
      const date = new Date(dateValue);
      loadEvents(date);
    } else {
      setEvents([]);
      setDisplayedEvents([]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 && displayedEvents.length < events.length) {
        setLoadMore((prev) => prev + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedEvents.length, events.length]);

  useEffect(() => {
    if (events.length > 0) {
      setDisplayedEvents(events.slice(0, loadMore));
    }
  }, [loadMore, events]);

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  return (
    <PageLayout>
      <div className={styles.headerCustom}>
        <h1 className={styles.mainTitle}>
          {selectedDate ? (
            <>
              <span>ON: </span>
              <span className={styles.highlight}>{formatDateForDisplay(selectedDate)}</span>
            </>
          ) : (
            "SELECT A DATE"
          )}
        </h1>
        {selectedDate && <p className={styles.description}>What happened on this day - Here you can enter a specific date to get only events that happened on this date</p>}
      </div>

      <div className={styles.controls}>
        <input id="date-picker" type="date" value={selectedDate} onChange={handleDateChange} className={styles.input} aria-label="Select date" />
      </div>

      {loading && <div className={styles.loading}>Loading events...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && displayedEvents.length > 0 && (
        <TimelineLayout>
          {displayedEvents.map((event, index) => (
            <TimelineItem key={`${event.year}-${index}`} event={event} side={index % 2 === 0 ? "right" : "left"} />
          ))}
        </TimelineLayout>
      )}

      {!loading && !error && displayedEvents.length === 0 && selectedDate && <div className={styles.noEvents}>No events found for this date.</div>}
    </PageLayout>
  );
}
