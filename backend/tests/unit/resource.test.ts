import * as resourceService from '../../src/modules/resource/resource.service';
import { Resource } from '../../src/modules/resource/resource.model';
import { AppError } from '../../src/utils/AppError';

jest.mock('../../src/modules/resource/resource.model');

describe('Unit Tests: Resource Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createResource', () => {
    it('should create and populate uploadedBy', async () => {
      const mockResource = {
        _id: '507f1f77bcf86cd799439044',
        title: 'Algorithms Mid-Term',
        courseCode: 'CSE-221',
        populate: jest.fn().mockResolvedValueOnce({
          _id: '507f1f77bcf86cd799439044',
          title: 'Algorithms Mid-Term',
          courseCode: 'CSE-221'
        })
      };

      (Resource.create as jest.Mock).mockResolvedValueOnce(mockResource);

      const result = await resourceService.createResource(
        {
          title: 'Algorithms Mid-Term',
          courseCode: 'CSE-221',
          courseTitle: 'Algorithms',
          department: 'CSE',
          semesterTerm: 'Mid-Term',
          academicSession: 'Fall 2024',
          fileUrl: 'https://example.com/file.pdf',
          fileFormat: 'PDF'
        },
        '507f1f77bcf86cd799439011'
      );

      expect(result.courseCode).toBe('CSE-221');
    });
  });

  describe('upvoteResource', () => {
    it('should atomically increment upvotes and return document', async () => {
      const mockUpdated = {
        _id: '507f1f77bcf86cd799439044',
        upvotes: 5,
        populate: jest.fn().mockResolvedValueOnce({
          _id: '507f1f77bcf86cd799439044',
          upvotes: 5
        })
      };

      (Resource.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(mockUpdated)
      });

      const result = await resourceService.upvoteResource('507f1f77bcf86cd799439044');
      expect(result.upvotes).toBe(5);
    });

    it('should throw 404 if resource does not exist', async () => {
      (Resource.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(null)
      });

      await expect(resourceService.upvoteResource('507f1f77bcf86cd799439044')).rejects.toThrow(AppError);
    });
  });
});
