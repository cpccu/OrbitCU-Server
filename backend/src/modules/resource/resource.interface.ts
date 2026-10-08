import { Document, Model, Types } from 'mongoose';
import { Department, FileFormat, SemesterTerm } from '../../constants/enums';

export interface IResource {
  title: string;
  courseCode: string;
  courseTitle: string;
  department: Department;
  semesterTerm: SemesterTerm;
  academicSession: string;
  fileUrl: string;
  fileFormat: FileFormat;
  uploadedBy: Types.ObjectId | string;
  upvotes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResourceDocument extends IResource, Document {}
export interface IResourceModel extends Model<IResourceDocument> {}
