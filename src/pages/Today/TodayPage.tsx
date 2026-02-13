import { useEffect, useState } from "react";
import { PageLayout } from "../../layouts/PageLayout";
import { TimelineLayout } from "../../layouts/TimelineLayout";
import { TimelineItem } from "../../components/TimelineItem";
import { fetchAllHistoryForDate } from "../../api/history";
import type { TimelineEvent } from "../../api/types";
import { getTimelineSides } from "../../api/timeline-utils";
import styles from "./TodayPage.module.scss";

export function TodayPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadMore, setLoadMore] = useState(10);

  // Generate random dates throughout the year (use random historical years)
  const generateRandomDates = (count: number = 5) => {
    const dates = [];

    for (let i = 0; i < count; i++) {
      const randomMonth = Math.floor(Math.random() * 12) + 1;
      const daysInMonth = new Date(2000, randomMonth, 0).getDate(); // Use 2000 as reference for days in month
      const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
      dates.push(new Date(2000, randomMonth - 1, randomDay)); // Year doesn't matter for fetchAllHistoryForDate
    }
    return dates;
  };

  useEffect(() => {
    const loadRandomEvents = async () => {
      try {
        setLoading(true);
        const randomDates = generateRandomDates(5);
        const allEvents: TimelineEvent[] = [];

        // Fetch events from multiple random dates
        for (const date of randomDates) {
          try {
            const data = await fetchAllHistoryForDate(date);
            allEvents.push(...data);
          } catch (dateError) {
            console.warn(`Failed to fetch events for ${date}:`, dateError);
          }
        }

        // Shuffle and deduplicate events
        const uniqueEvents = allEvents.filter((event, index, arr) => arr.findIndex((e) => e.year === event.year && e.text === event.text) === index);

        const shuffledEvents = uniqueEvents.sort(() => Math.random() - 0.5);
        setEvents(shuffledEvents);
        setDisplayedEvents(shuffledEvents.slice(0, 10));
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRandomEvents();
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

  // Get timeline sides - you can easily change the pattern here
  const timelineSides = getTimelineSides(displayedEvents, {
    pattern: "default", // Normal alternating left-right pattern
    startSide: "left", // Start with left side
    // For custom pattern, add: customPattern: ['left', 'right', 'right', 'left']
  });

  if (loading) {
    return (
      <PageLayout>
        <div className={styles.loading}>Loading random historical events...</div>
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
      <div className={styles.headerCustom}>
        <h1 className={styles.mainTitle}>Random Historical Events</h1>
        <p className={styles.description}>Discover fascinating events from random dates throughout history</p>
      </div>

      <TimelineLayout>
        {displayedEvents.map((event, index) => (
          <TimelineItem key={`${event.year}-${index}`} event={event} side={timelineSides[index]} />
        ))}
      </TimelineLayout>
    </PageLayout>
  );
}
