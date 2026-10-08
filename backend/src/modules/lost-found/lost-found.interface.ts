import { Document, Model, Types } from 'mongoose';
import {
  LostFoundCategory,
  LostFoundStatus,
  LostFoundType
} from '../../constants/enums';

export interface ILostFound {
  type: LostFoundType;
  title: string;
  category: LostFoundCategory;
  locationFoundOrLost: string;
  dateOfIncident: Date;
  description: string;
  imageUrl?: string;
  status: LostFoundStatus;
  contactNumberOrEmail: string;
  reporterId: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILostFoundDocument extends ILostFound, Document {}
export interface ILostFoundModel extends Model<ILostFoundDocument> {}
