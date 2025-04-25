import { UserPreference } from './UserPreference';
import { DailyItinerary } from './DailyItinerary';
import { PlanSource } from './Enums';

export interface TravelPlan {
  id: string;
  title: string;
  preference: UserPreference;
  plan: DailyItinerary[];
  createdAt: string;
  isEditable: boolean;
  source: 'generated' | 'manual';
  days: {
    date: string;
    activities: string[];
  }[];
}
