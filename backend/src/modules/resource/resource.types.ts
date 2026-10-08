import { Department, FileFormat, SemesterTerm } from '../../constants/enums';

export interface CreateResourceInput {
  title: string;
  courseCode: string;
  courseTitle: string;
  department: Department;
  semesterTerm: SemesterTerm;
  academicSession: string;
  fileUrl: string;
  fileFormat: FileFormat;
}

export interface ResourceFilterQuery {
  department?: Department;
  courseCode?: string;
  semesterTerm?: SemesterTerm;
  session?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ResourceSearchQuery {
  q?: string;
  page?: string | number;
  limit?: string | number;
}
