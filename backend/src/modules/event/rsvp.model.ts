import { Schema, model } from 'mongoose';
import { IRSVPDocument, IRSVPModel } from './event.interface';

const rsvpSchema = new Schema<IRSVPDocument, IRSVPModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required']
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student user ID is required']
    },
    studentUniversityId: {
      type: String,
      required: [true, 'Student university ID is required'],
      trim: true
    },
    ticketHash: {
      type: String,
      required: [true, 'Ticket hash is required'],
      unique: true,
      trim: true
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to prevent duplicate RSVPs for the same event and student
rsvpSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export const RSVP = model<IRSVPDocument, IRSVPModel>('RSVP', rsvpSchema);
