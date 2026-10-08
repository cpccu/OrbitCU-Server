import { Schema, model } from 'mongoose';
import { IFAQDocument, IFAQModel } from './helpdesk.interface';
import { FAQ_CATEGORIES } from '../../constants/enums';

const faqSchema = new Schema<IFAQDocument, IFAQModel>(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer is required']
    },
    category: {
      type: String,
      enum: {
        values: FAQ_CATEGORIES,
        message: '{VALUE} is not a valid FAQ category'
      },
      required: [true, 'Category is required']
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    referenceUrl: {
      type: String,
      trim: true,
      default: ''
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Updater user ID is required']
    }
  },
  {
    timestamps: true
  }
);

// Compound text index on question and answer
faqSchema.index({ question: 'text', answer: 'text' });
// Compound index on isPinned and createdAt
faqSchema.index({ isPinned: -1, createdAt: -1 });

export const FAQ = model<IFAQDocument, IFAQModel>('FAQ', faqSchema);
