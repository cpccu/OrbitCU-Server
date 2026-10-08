import { Document, Model, Types } from 'mongoose';
import { ComplaintCategory, ComplaintStatus } from '../../constants/enums';

export interface IComplaint {
  ticketId: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  locationRoom: string;
  isAnonymous: boolean;
  submittedBy?: Types.ObjectId | string | null;
  status: ComplaintStatus;
  adminRemarks: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComplaintDocument extends IComplaint, Document {}
export interface IComplaintModel extends Model<IComplaintDocument> {}
