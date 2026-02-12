import { useEffect, useState } from "react";
import { PageLayout } from "../../layouts/PageLayout";
import { TimelineLayout } from "../../layouts/TimelineLayout";
import { TimelineItem } from "../../components/TimelineItem";
import { fetchByDate } from "../../api/history";
import type { TimelineEvent } from "../../api/types";
import styles from "./SincePage.module.scss";

export function SincePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sinceYear, setSinceYear] = useState("");
  const [loadMore, setLoadMore] = useState(10);

  const loadEvents = async (year: number) => {
    try {
      setLoading(true);
      setError(null);
      // Fetch events for today's specific date
      const today = new Date();
      const allEvents = await fetchByDate(today);

      // Filter to show ONLY events from the selected year on this specific day
      const filteredEvents = allEvents.filter((event) => event.year === year);
      setEvents(filteredEvents);
      setDisplayedEvents(filteredEvents.slice(0, 10));
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

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const yearValue = e.target.value;
    setSinceYear(yearValue);

    if (yearValue && !isNaN(parseInt(yearValue))) {
      const year = parseInt(yearValue);
      loadEvents(year);
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

  return (
    <PageLayout>
      <div className={styles.headerCustom}>
        <h1 className={styles.mainTitle}>
          {sinceYear ? (
            <>
              <span>SINCE: </span>
              <span className={styles.highlight}>{sinceYear}</span>
            </>
          ) : (
            "ENTER A YEAR"
          )}
        </h1>
        {sinceYear && <p className={styles.description}>What happened on this day - Here you can enter a specific year to get only events for that year</p>}
      </div>

      <div className={styles.controls}>
        <input
          id="year-picker"
          type="number"
          min="1"
          max={new Date().getFullYear()}
          value={sinceYear}
          onChange={handleYearChange}
          placeholder="e.g., 1947"
          className={styles.input}
          aria-label="Enter year"
        />
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

      {!loading && !error && displayedEvents.length === 0 && sinceYear && <div className={styles.noEvents}>No events found for {sinceYear}.</div>}
    </PageLayout>
  );
}
