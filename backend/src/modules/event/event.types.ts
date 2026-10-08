import { EventCategory, EventTimeFrame } from '../../constants/enums';

export interface CreateEventInput {
  title: string;
  clubName: string;
  category: EventCategory;
  description: string;
  bannerUrl: string;
  venue: string;
  eventDate: string | Date;
  registrationDeadline: string | Date;
  maxCapacity: number;
  isInterUniversity?: boolean;
}

export interface EventFilterQuery {
  category?: EventCategory;
  timeFrame?: EventTimeFrame;
  search?: string;
  page?: string | number;
  limit?: string | number;
}
