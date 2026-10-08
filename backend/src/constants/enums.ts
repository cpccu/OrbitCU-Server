export const DEPARTMENTS = [
  'CSE',
  'EEE',
  'BBA',
  'English',
  'Law',
  'Civil',
  'Pharmacy'
] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const EVENT_CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Debate',
  'Academic',
  'Career'
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_TIME_FRAMES = ['upcoming', 'today', 'past'] as const;
export type EventTimeFrame = (typeof EVENT_TIME_FRAMES)[number];

export const SEMESTER_TERMS = [
  'Mid-Term',
  'Final-Term',
  'Quiz',
  'Lab Manual',
  'Lecture Note'
] as const;
export type SemesterTerm = (typeof SEMESTER_TERMS)[number];

export const FILE_FORMATS = ['PDF', 'DOCX', 'ZIP', 'IMAGE'] as const;
export type FileFormat = (typeof FILE_FORMATS)[number];

export const FAQ_CATEGORIES = [
  'Accounts & Waivers',
  'Examinations & Grading',
  'Registrar & Admission',
  'Library & Labs',
  'General'
] as const;
export type FAQCategory = (typeof FAQ_CATEGORIES)[number];

export const LOST_FOUND_TYPES = ['LOST', 'FOUND'] as const;
export type LostFoundType = (typeof LOST_FOUND_TYPES)[number];

export const LOST_FOUND_CATEGORIES = [
  'ID Card',
  'Calculator',
  'Electronics',
  'Documents/Books',
  'Wallets/Bags',
  'Personal Accessories'
] as const;
export type LostFoundCategory = (typeof LOST_FOUND_CATEGORIES)[number];

export const LOST_FOUND_STATUSES = ['OPEN', 'RESOLVED'] as const;
export type LostFoundStatus = (typeof LOST_FOUND_STATUSES)[number];

export const COMPLAINT_CATEGORIES = [
  'Classroom Infrastructure',
  'Lab Equipment',
  'Sanitation & Hygiene',
  'Proctorial/Security',
  'Administrative Office'
] as const;
export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number];

export const COMPLAINT_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ACTION_TAKEN',
  'RESOLVED'
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const PATTERNS = {
  COURSE_CODE: /^[A-Z]{3,4}[- ]?[0-9]{3,4}$/,
  TICKET_ID: /^CU-TICK-[0-9]{4}$/
} as const;
