import { ComplaintCategory, ComplaintStatus } from '../../constants/enums';

export interface CreateComplaintInput {
  title: string;
  category: ComplaintCategory;
  description: string;
  locationRoom: string;
  isAnonymous?: boolean;
}

export interface UpdateComplaintStatusInput {
  status: ComplaintStatus;
  adminRemarks?: string;
}

export interface ComplaintFilterQuery {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  page?: string | number;
  limit?: string | number;
}

export interface PublicComplaintTrackInfo {
  ticketId: string;
  title: string;
  category: ComplaintCategory;
  locationRoom: string;
  status: ComplaintStatus;
  adminRemarks: string;
  createdAt: Date;
  updatedAt: Date;
}
