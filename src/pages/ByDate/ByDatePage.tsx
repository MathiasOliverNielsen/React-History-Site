import { useEffect, useState } from "react";
import { PageLayout } from "../../layouts/PageLayout";
import { TimelineLayout } from "../../layouts/TimelineLayout";
import { TimelineItem } from "../../components/TimelineItem";
import { fetchMultipleDaysAllHistory } from "../../api/history";
import type { TimelineEvent } from "../../api/types";
import { getTimelineSides } from "../../api/timeline-utils";
import { subscribeDateChange } from "../../components/Header/Header";
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

      const data = await fetchMultipleDaysAllHistory(date);

      if (data.length === 0) {
        const endDate = new Date(date);
        endDate.setDate(date.getDate() + 2);
        setError(`No historical events found for ${date.toLocaleDateString()} through ${endDate.toLocaleDateString()}. This period may not have any recorded historical events.`);
      }

      setEvents(data);
      setLoadMore(10);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error(err);
      setEvents([]);
      setLoadMore(10);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to date changes from Header
  useEffect(() => {
    const unsubscribe = subscribeDateChange((dateValue: string) => {
      setSelectedDate(dateValue);

      if (dateValue) {
        const date = new Date(dateValue);
        loadEvents(date);
      } else {
        setEvents([]);
        setDisplayedEvents([]);
        setError(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;
      const isNearBottom = scrollY + innerHeight >= scrollHeight - 200;
      const hasMoreEvents = displayedEvents.length < events.length;

      if (isNearBottom && hasMoreEvents && !loading) {
        setLoadMore((prev) => prev + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedEvents.length, events.length, loading]);

  useEffect(() => {
    if (events.length > 0) {
      const newDisplayedEvents = events.slice(0, loadMore);
      setDisplayedEvents(newDisplayedEvents);
    } else {
      setDisplayedEvents([]);
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
      {loading && <div className={styles.loading}>Loading events...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && displayedEvents.length > 0 && (
        <>
          <TimelineLayout>
            {(() => {
              // Get timeline sides - easily change pattern here
              const timelineSides = getTimelineSides(displayedEvents, {
                pattern: "default", // Normal alternating pattern
                startSide: "left", // Start with left side
              });

              return displayedEvents.map((event, index) => <TimelineItem key={`${event.year}-${index}`} event={event} side={timelineSides[index]} />);
            })()}
          </TimelineLayout>

          {/* Show "scroll for more" indicator when there are more events */}
          {displayedEvents.length < events.length && (
            <div className={styles.loadMoreIndicator}>
              Scroll down to load more events ({displayedEvents.length} of {events.length} shown)
            </div>
          )}
        </>
      )}

      {!loading && !error && !selectedDate && <div className={styles.noEvents}>Please select a date above to view historical events.</div>}

      {!loading && !error && displayedEvents.length === 0 && selectedDate && (
        <div className={styles.noEvents}>No historical events found for {formatDateForDisplay(selectedDate)}. Try selecting a different date.</div>
      )}
    </PageLayout>
  );
}
