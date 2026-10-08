import { FAQCategory } from '../../constants/enums';

export interface CreateFAQInput {
  question: string;
  answer: string;
  category: FAQCategory;
  isPinned?: boolean;
  referenceUrl?: string;
}

export interface UpdateFAQInput {
  question?: string;
  answer?: string;
  category?: FAQCategory;
  isPinned?: boolean;
  referenceUrl?: string;
}

export interface FAQFilterQuery {
  category?: FAQCategory;
  search?: string;
}
