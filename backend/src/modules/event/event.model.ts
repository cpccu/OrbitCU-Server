import { Schema, model } from 'mongoose';
import { IEventDocument, IEventModel } from './event.interface';
import { EVENT_CATEGORIES } from '../../constants/enums';

const eventSchema = new Schema<IEventDocument, IEventModel>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    clubName: {
      type: String,
      required: [true, 'Club name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: {
        values: EVENT_CATEGORIES,
        message: '{VALUE} is not a valid event category'
      },
      required: [true, 'Event category is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    bannerUrl: {
      type: String,
      required: [true, 'Banner URL is required'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, 'Registered count cannot be negative']
    },
    isInterUniversity: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event creator ID is required']
    }
  },
  {
    timestamps: true
  }
);

// Compound index on eventDate and category
eventSchema.index({ eventDate: 1, category: 1 });
// Text index for search
eventSchema.index({ title: 'text', clubName: 'text', description: 'text' });

export const Event = model<IEventDocument, IEventModel>('Event', eventSchema);
