import {
  LostFoundCategory,
  LostFoundStatus,
  LostFoundType
} from '../../constants/enums';

export interface CreateLostFoundInput {
  type: LostFoundType;
  title: string;
  category: LostFoundCategory;
  locationFoundOrLost: string;
  dateOfIncident: string | Date;
  description: string;
  imageUrl?: string;
  contactNumberOrEmail: string;
}

export interface LostFoundFilterQuery {
  status?: string; // 'OPEN' | 'RESOLVED' | 'ALL'
  type?: LostFoundType;
  category?: LostFoundCategory;
  search?: string;
  page?: string | number;
  limit?: string | number;
}
