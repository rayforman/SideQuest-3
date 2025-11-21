export interface Activity {
  name: string;
  duration: string;
  price: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  budget_level: string;
  duration: string;
  duration_days: number;
  total_price: number;
  currency: string;
  destination: string;
  activities: Activity[];
  itinerary: ItineraryDay[];
  categories: string[];
  created_at: string;
  is_liked?: boolean;
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  interests: string[];
  home_location: string;
  budget_preference: string;
  duration_preference: string;
}
