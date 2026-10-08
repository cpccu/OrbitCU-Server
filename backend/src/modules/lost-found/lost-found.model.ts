import { Schema, model } from 'mongoose';
import { ILostFoundDocument, ILostFoundModel } from './lost-found.interface';
import {
  LOST_FOUND_CATEGORIES,
  LOST_FOUND_STATUSES,
  LOST_FOUND_TYPES
} from '../../constants/enums';

const lostFoundSchema = new Schema<ILostFoundDocument, ILostFoundModel>(
  {
    type: {
      type: String,
      enum: {
        values: LOST_FOUND_TYPES,
        message: '{VALUE} is not a valid type'
      },
      required: [true, 'Type (LOST or FOUND) is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: {
        values: LOST_FOUND_CATEGORIES,
        message: '{VALUE} is not a valid category'
      },
      required: [true, 'Category is required']
    },
    locationFoundOrLost: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    dateOfIncident: {
      type: Date,
      required: [true, 'Date of incident is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: LOST_FOUND_STATUSES,
        message: '{VALUE} is not a valid status'
      },
      default: 'OPEN'
    },
    contactNumberOrEmail: {
      type: String,
      required: [true, 'Contact number or email is required'],
      trim: true
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter user ID is required']
    }
  },
  {
    timestamps: true
  }
);

lostFoundSchema.index({ status: 1, createdAt: -1 });
lostFoundSchema.index({ type: 1, category: 1 });

export const LostFound = model<ILostFoundDocument, ILostFoundModel>(
  'LostFound',
  lostFoundSchema
);
