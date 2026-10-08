import { Schema, model } from 'mongoose';
import { IComplaintDocument, IComplaintModel } from './complaint.interface';
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
  PATTERNS
} from '../../constants/enums';

const complaintSchema = new Schema<IComplaintDocument, IComplaintModel>(
  {
    ticketId: {
      type: String,
      required: [true, 'Ticket ID is required'],
      unique: true,
      trim: true,
      match: [PATTERNS.TICKET_ID, 'Ticket ID must follow format CU-TICK-XXXX']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: {
        values: COMPLAINT_CATEGORIES,
        message: '{VALUE} is not a valid complaint category'
      },
      required: [true, 'Category is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    locationRoom: {
      type: String,
      required: [true, 'Room or location is required'],
      trim: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: {
        values: COMPLAINT_STATUSES,
        message: '{VALUE} is not a valid complaint status'
      },
      default: 'SUBMITTED'
    },
    adminRemarks: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound / field indices (ticketId index is created by unique: true)
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ submittedBy: 1 });

export const Complaint = model<IComplaintDocument, IComplaintModel>(
  'Complaint',
  complaintSchema
);
