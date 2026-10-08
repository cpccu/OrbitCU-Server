import { createResourceSchema } from '../../src/modules/resource/resource.validation';
import { createEventSchema } from '../../src/modules/event/event.validation';

describe('Unit Tests: Validation Schemas', () => {
  describe('Resource Validation', () => {
    it('should validate valid course codes (e.g. CSE-221, MATH 2105, HIST 2100)', () => {
      const baseResource = {
        title: 'Algorithms Mid-Term',
        courseTitle: 'Algorithms',
        department: 'CSE',
        semesterTerm: 'Mid-Term',
        academicSession: 'Fall 2024',
        fileUrl: 'https://example.com/file.pdf',
        fileFormat: 'PDF'
      };

      const validCodes = ['CSE-221', 'MATH 2105', 'HIST 2100', 'MATH-2105', 'CSE 2100', 'MATH-210'];
      for (const code of validCodes) {
        const result = createResourceSchema.safeParse({ ...baseResource, courseCode: code });
        expect(result.success).toBe(true);
      }
    });

    it('should reject invalid course codes (e.g. cse221, CS-22, 123-ABC)', () => {
      const invalidResource = {
        title: 'Algorithms Mid-Term',
        courseCode: 'invalid-code',
        courseTitle: 'Algorithms',
        department: 'CSE',
        semesterTerm: 'Mid-Term',
        academicSession: 'Fall 2024',
        fileUrl: 'https://example.com/file.pdf',
        fileFormat: 'PDF'
      };

      const result = createResourceSchema.safeParse(invalidResource);
      expect(result.success).toBe(false);
    });
  });

  describe('Event Validation', () => {
    it('should reject event creation if registrationDeadline is after or equal to eventDate', () => {
      const now = new Date();
      const pastDeadline = new Date(now.getTime() + 1000 * 60 * 60 * 48).toISOString();
      const earlierEvent = new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString();

      const invalidEvent = {
        title: 'Annual Hackathon',
        clubName: 'CU Computer Club',
        category: 'Technical',
        description: '24-hour coding sprint',
        bannerUrl: 'https://example.com/banner.jpg',
        venue: 'Main Lab',
        eventDate: earlierEvent,
        registrationDeadline: pastDeadline,
        maxCapacity: 50,
        isInterUniversity: false
      };

      const result = createEventSchema.safeParse(invalidEvent);
      expect(result.success).toBe(false);
    });
  });
});
