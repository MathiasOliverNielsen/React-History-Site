import { useEffect, useState } from "react";
import { PageLayout } from "../../layouts/PageLayout";
import { TimelineLayout } from "../../layouts/TimelineLayout";
import { TimelineItem } from "../../components/TimelineItem";
import { fetchByDate } from "../../api/history";
import type { TimelineEvent } from "../../api/types";
import styles from "./TodayPage.module.scss";

export function TodayPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadMore, setLoadMore] = useState(10);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const data = await fetchByDate(today);
        setEvents(data);
        setDisplayedEvents(data.slice(0, 10));
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

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

  if (loading) {
    return (
      <PageLayout>
        <div className={styles.loading}>Loading today's events...</div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className={styles.error}>{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TimelineLayout>
        {displayedEvents.map((event, index) => (
          <TimelineItem key={`${event.year}-${index}`} event={event} side={index % 2 === 0 ? "right" : "left"} />
        ))}
      </TimelineLayout>
    </PageLayout>
  );
}
