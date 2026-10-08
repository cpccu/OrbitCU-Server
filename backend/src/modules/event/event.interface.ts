import { Document, Model, Types } from 'mongoose';
import { EventCategory } from '../../constants/enums';

export interface IEvent {
  title: string;
  clubName: string;
  category: EventCategory;
  description: string;
  bannerUrl: string;
  venue: string;
  eventDate: Date;
  registrationDeadline: Date;
  maxCapacity: number;
  registeredCount: number;
  isInterUniversity: boolean;
  createdBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventDocument extends IEvent, Document {}
export interface IEventModel extends Model<IEventDocument> {}

export interface IRSVP {
  eventId: Types.ObjectId | string;
  studentId: Types.ObjectId | string;
  studentUniversityId: string;
  ticketHash: string;
  registrationDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRSVPDocument extends IRSVP, Document {}
export interface IRSVPModel extends Model<IRSVPDocument> {}
