import { ApiResponse, TimelineEvent } from "./types";

const API_BASE_URL = "https://history.muffinlabs.com/date";

/**
 * Fetches historical events for a specific date
 * @param date - The date to fetch events for
 * @returns Array of timeline events sorted by year (ascending)
 */
export async function fetchByDate(date: Date): Promise<TimelineEvent[]> {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  const url = `${API_BASE_URL}/${month}/${day}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();

    return parseApiResponse(data);
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
