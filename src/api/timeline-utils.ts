import type { TimelineEvent } from "./types";

// Timeline side alternation patterns
export type AlternationPattern = "default" | "reverse" | "all-left" | "all-right" | "custom";

interface AlternationOptions {
  pattern?: AlternationPattern;
  customPattern?: ("left" | "right")[];
  startSide?: "left" | "right";
}

/**
 * Determines the side for each timeline item based on the specified pattern
 */
export function getTimelineSides(events: TimelineEvent[], options: AlternationOptions = {}): ("left" | "right")[] {
  const { pattern = "default", customPattern, startSide = "left" } = options;

  switch (pattern) {
    case "all-left":
      return Array(events.length).fill("left");

    case "all-right":
      return Array(events.length).fill("right");

    case "reverse":
      return events.map((_, index) => (startSide === "left" ? (index % 2 === 0 ? "right" : "left") : index % 2 === 0 ? "left" : "right"));

    case "custom":
      if (!customPattern) return getTimelineSides(events, { pattern: "default", startSide });
      return events.map((_, index) => customPattern[index % customPattern.length]);

    case "default":
    default:
      return events.map((_, index) => (startSide === "left" ? (index % 2 === 0 ? "left" : "right") : index % 2 === 0 ? "right" : "left"));
  }
}

/**
 * Groups events by type for better visual organization
 */
export function organizeEventsByType(events: TimelineEvent[]): {
  events: TimelineEvent[];
  births: TimelineEvent[];
  deaths: TimelineEvent[];
} {
  return {
    events: events.filter((e) => e.type === "event"),
    births: events.filter((e) => e.type === "birth"),
    deaths: events.filter((e) => e.type === "death"),
  };
}
