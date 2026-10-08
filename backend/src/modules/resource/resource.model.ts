import { Schema, model } from 'mongoose';
import { IResourceDocument, IResourceModel } from './resource.interface';
import { DEPARTMENTS, FILE_FORMATS, PATTERNS, SEMESTER_TERMS } from '../../constants/enums';

const resourceSchema = new Schema<IResourceDocument, IResourceModel>(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
      index: true,
      match: [PATTERNS.COURSE_CODE, 'Course code must contain 3 or 4 letters and 3 or 4 digits (e.g., CSE-221, MATH 2105)']
    },
    courseTitle: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    department: {
      type: String,
      enum: {
        values: DEPARTMENTS,
        message: '{VALUE} is not a valid department'
      },
      required: [true, 'Department is required']
    },
    semesterTerm: {
      type: String,
      enum: {
        values: SEMESTER_TERMS,
        message: '{VALUE} is not a valid semester term'
      },
      required: [true, 'Semester term is required']
    },
    academicSession: {
      type: String,
      required: [true, 'Academic session is required'],
      trim: true
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true
    },
    fileFormat: {
      type: String,
      enum: {
        values: FILE_FORMATS,
        message: '{VALUE} is not a valid file format'
      },
      required: [true, 'File format is required']
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required']
    },
    upvotes: {
      type: Number,
      default: 0,
      min: [0, 'Upvotes cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Compound text index on courseCode, courseTitle, title
resourceSchema.index({ courseCode: 'text', courseTitle: 'text', title: 'text' });

export const Resource = model<IResourceDocument, IResourceModel>('Resource', resourceSchema);
