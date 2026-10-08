import { Document, Model, Types } from 'mongoose';
import { FAQCategory } from '../../constants/enums';

export interface IFAQ {
  question: string;
  answer: string;
  category: FAQCategory;
  isPinned: boolean;
  referenceUrl?: string;
  updatedBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFAQDocument extends IFAQ, Document {}
export interface IFAQModel extends Model<IFAQDocument> {}
