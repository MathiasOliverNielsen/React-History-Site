// Raw API response from MuffinLabs API
export interface ApiEvent {
  text: string;
  year: string;
  pages?: Array<{
    title: string;
    content?: {
      urls?: {
        desktop?: {
          page?: string;
        };
      };
    };
  }>;
  links?: Array<{
    title: string;
    link: string;
  }>;
}

export interface ApiResponse {
  data: {
    Events?: ApiEvent[];
    Births?: ApiEvent[];
    Deaths?: ApiEvent[];
  };
}

// Internal timeline event type
export interface TimelineEvent {
  year: number;
  text: string;
  wikipediaUrl?: string;
  type: "event" | "birth" | "death";
  eventDate?: Date; // Added to track which day the event is from
}
