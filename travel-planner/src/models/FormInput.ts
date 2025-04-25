import { Interest } from './Enums';

export interface FormInput {
  originCity: string;
  destinationCity: string;
  startDate: string;
  endDate: string;
  interests: string[];
}
