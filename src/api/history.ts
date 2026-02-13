import type { ApiResponse, TimelineEvent } from "./types";

const API_BASE_URL = "https://history.muffinlabs.com/date";

// Simple cache to avoid refetching the same date ranges
const cache = new Map<string, TimelineEvent[]>();
const allHistoryCache = new Map<string, TimelineEvent[]>();

/**
 * Fetches ALL historical events for a specific date (all years)
 * Used for the Today page to show historical events from any year
 * @param date - The date to fetch events for
 * @returns Array of all timeline events for this day throughout history
 */
export async function fetchAllHistoryForDate(date: Date): Promise<TimelineEvent[]> {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const cacheKey = `all-${month}-${day}`;

  // Check cache first
  if (allHistoryCache.has(cacheKey)) {
    return allHistoryCache.get(cacheKey)!;
  }

  const url = `${API_BASE_URL}/${month}/${day}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    const allEvents = parseApiResponse(data);

    // Cache the result
    allHistoryCache.set(cacheKey, allEvents);

    return allEvents;
  } catch (error) {
    console.error("Error fetching historical events:", error);
    throw error;
  }
}

/**
 * Fetches ALL historical events for a specific date and the next 2 days (3 days total)
 * Used specifically for the ByDate page to show historical events across all years
 * @param date - The starting date to fetch events for
 * @returns Array of timeline events from the selected date + next 2 days, from all years
 */
export async function fetchMultipleDaysAllHistory(date: Date): Promise<TimelineEvent[]> {
  const allEvents: TimelineEvent[] = [];

  // Fetch events for the selected date + next 2 days (3 total days)
  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() + dayOffset);

    try {
      const dayEvents = await fetchAllHistoryForDate(currentDate);

      // Add specific date information to events
      dayEvents.forEach((event) => {
        event.eventDate = new Date(currentDate);
      });

      allEvents.push(...dayEvents);
    } catch (error) {
      console.warn(`Error fetching events for ${currentDate.toDateString()}:`, error);
      // Continue with other days even if one fails
    }
  }

  // Sort by date first, then by year
  return allEvents.sort((a, b) => {
    if (a.eventDate && b.eventDate) {
      const dateCompare = a.eventDate.getTime() - b.eventDate.getTime();
      if (dateCompare !== 0) return dateCompare;
    }
    return a.year - b.year;
  });
}

/**
 * Fetches historical events for a specific date, filtered by year
 * Used for Since page to show events from a specific year
 * @param date - The date to fetch events for
 * @returns Array of timeline events filtered by the date's year
 */
export async function fetchByDate(date: Date): Promise<TimelineEvent[]> {
  const year = date.getFullYear();
  const cacheKey = `${year}-${date.getMonth()}-${date.getDate()}`;

  // Check cache first
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const url = `${API_BASE_URL}/${month}/${day}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    const allEvents = parseApiResponse(data);

    // Filter events to only include the specific year requested
    const filteredEvents = allEvents.filter((event) => event.year === year);

    // Cache the result
    cache.set(cacheKey, filteredEvents);

    return filteredEvents;
  } catch (error) {
    console.error("Error fetching historical events:", error);
    throw error;
  }
}

/**
 * Parses the API response and converts it to TimelineEvent objects
 */
function parseApiResponse(data: ApiResponse): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Process Events
  if (data.data.Events) {
    data.data.Events.forEach((event) => {
      events.push({
        year: parseInt(event.year),
        text: event.text,
        wikipediaUrl: extractWikipediaUrl(event),
        type: "event",
      });
    });
  }

  // Process Births
  if (data.data.Births) {
    data.data.Births.forEach((event) => {
      events.push({
        year: parseInt(event.year),
        text: event.text,
        wikipediaUrl: extractWikipediaUrl(event),
        type: "birth",
      });
    });
  }

  // Process Deaths
  if (data.data.Deaths) {
    data.data.Deaths.forEach((event) => {
      events.push({
        year: parseInt(event.year),
        text: event.text,
        wikipediaUrl: extractWikipediaUrl(event),
        type: "death",
      });
    });
  }

  // Sort by year (ascending)
  return events.sort((a, b) => a.year - b.year);
}

/**
 * Extracts Wikipedia URL from event data
 * Uses the first available page's desktop URL
 */
function extractWikipediaUrl(event: any): string | undefined {
  // Try links array first
  if (event.links && event.links.length > 0) {
    return event.links[0].link;
  }

  // Try pages array
  if (event.pages && event.pages.length > 0) {
    const page = event.pages[0];
    const url = page.content?.urls?.desktop?.page;
    if (url) {
      return url;
    }
  }

  return undefined;
}
