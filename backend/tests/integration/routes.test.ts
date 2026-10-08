import request from 'supertest';
import { app } from '../../src/app';
import { User } from '../../src/modules/auth/auth.model';
import { Event } from '../../src/modules/event/event.model';
import { RSVP } from '../../src/modules/event/rsvp.model';
import { Resource } from '../../src/modules/resource/resource.model';
import { FAQ } from '../../src/modules/helpdesk/helpdesk.model';
import { LostFound } from '../../src/modules/lost-found/lost-found.model';
import { Complaint } from '../../src/modules/complaint/complaint.model';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../src/config/jwt';

jest.mock('../../src/modules/auth/auth.model');
jest.mock('../../src/modules/event/event.model');
jest.mock('../../src/modules/event/rsvp.model');
jest.mock('../../src/modules/resource/resource.model');
jest.mock('../../src/modules/helpdesk/helpdesk.model');
jest.mock('../../src/modules/lost-found/lost-found.model');
jest.mock('../../src/modules/complaint/complaint.model');

describe('API Route Integration Tests', () => {
  const studentUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Tanvir Ahmed',
    universityId: '2021-1-60-001',
    email: 'student@city.edu',
    department: 'CSE',
    role: 'STUDENT',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const adminUser = {
    _id: '507f1f77bcf86cd799439099',
    name: 'Prof. Dr. M. Rahman',
    universityId: 'ADMIN-001',
    email: 'admin@city.edu',
    department: 'CSE',
    role: 'UNIVERSITY_ADMIN',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const studentToken = jwt.sign(
    { id: studentUser._id, email: studentUser.email, role: studentUser.role },
    jwtConfig.secret
  );

  const adminToken = jwt.sign(
    { id: adminUser._id, email: adminUser.email, role: adminUser.role },
    jwtConfig.secret
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (User.findById as jest.Mock).mockImplementation((id) => {
      const target =
        id && id.toString() === studentUser._id
          ? studentUser
          : id && id.toString() === adminUser._id
            ? adminUser
            : null;
      const query: any = Promise.resolve(target);
      query.select = jest.fn().mockResolvedValue(target);
      return query;
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 OK and status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('CampusOS API is operational');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a student and return 201 Created', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValueOnce(studentUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Tanvir Ahmed',
          universityId: '2021-1-60-001',
          email: 'student@city.edu',
          password: 'password123',
          department: 'CSE',
          role: 'STUDENT'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 400 Bad Request on invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Tanvir Ahmed',
          universityId: '2021-1-60-001',
          email: 'not-an-email',
          password: 'password123',
          department: 'CSE'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 200 OK with authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.universityId).toBe('2021-1-60-001');
    });

    it('should return 401 Unauthorized when missing token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/events/:id/rsvp', () => {
    it('should allow student to RSVP and return 201 Created', async () => {
      (Event.findById as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439022',
        registrationDeadline: new Date(Date.now() + 100000)
      });
      (RSVP.findOne as jest.Mock).mockResolvedValueOnce(null);
      (Event.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439022'
      });
      (RSVP.create as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439033',
        eventId: '507f1f77bcf86cd799439022',
        ticketHash: 'fedcba9876543210fedcba9876543210',
        populate: jest.fn().mockResolvedValueOnce({
          _id: '507f1f77bcf86cd799439033',
          ticketHash: 'fedcba9876543210fedcba9876543210'
        })
      });

      const res = await request(app)
        .post('/api/events/507f1f77bcf86cd799439022/rsvp')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ticketHash).toBeDefined();
    });
  });

  describe('POST /api/resources', () => {
    it('should upload academic resource and return 201 Created', async () => {
      const mockResource = {
        _id: '507f1f77bcf86cd799439044',
        title: 'CSE-221 Algorithms Mid-Term',
        courseCode: 'CSE-221',
        courseTitle: 'Algorithms',
        department: 'CSE',
        populate: jest.fn().mockResolvedValueOnce({
          _id: '507f1f77bcf86cd799439044',
          courseCode: 'CSE-221'
        })
      };
      (Resource.create as jest.Mock).mockResolvedValueOnce(mockResource);

      const res = await request(app)
        .post('/api/resources')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'CSE-221 Algorithms Mid-Term',
          courseCode: 'CSE-221',
          courseTitle: 'Algorithms',
          department: 'CSE',
          semesterTerm: 'Mid-Term',
          academicSession: 'Fall 2024',
          fileUrl: 'https://example.com/paper.pdf',
          fileFormat: 'PDF'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject invalid courseCode format with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/resources')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'CSE-221 Algorithms Mid-Term',
          courseCode: 'INVALID_CODE',
          courseTitle: 'Algorithms',
          department: 'CSE',
          semesterTerm: 'Mid-Term',
          academicSession: 'Fall 2024',
          fileUrl: 'https://example.com/paper.pdf',
          fileFormat: 'PDF'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Helpdesk Module (/api/helpdesk)', () => {
    it('POST /api/helpdesk should allow UNIVERSITY_ADMIN to create FAQ', async () => {
      const mockFAQ = {
        _id: '507f1f77bcf86cd799439055',
        question: 'What is the waiver policy?',
        answer: 'Detailed policy...',
        category: 'Accounts & Waivers',
        isPinned: true,
        populate: jest.fn().mockResolvedValueOnce({
          _id: '507f1f77bcf86cd799439055',
          question: 'What is the waiver policy?'
        })
      };
      (FAQ.create as jest.Mock).mockResolvedValueOnce(mockFAQ);

      const res = await request(app)
        .post('/api/helpdesk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          question: 'What is the waiver policy?',
          answer: 'Detailed policy regarding tuition waivers for CGPA 3.85+.',
          category: 'Accounts & Waivers',
          isPinned: true
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/helpdesk should reject STUDENT with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/helpdesk')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          question: 'What is the waiver policy?',
          answer: 'Detailed policy regarding tuition waivers.',
          category: 'Accounts & Waivers'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('Complaints Module (/api/complaints)', () => {
    it('POST /api/complaints with isAnonymous: true should strip submittedBy', async () => {
      (Complaint.findOne as jest.Mock).mockResolvedValue(null);
      (Complaint.create as jest.Mock).mockImplementationOnce((data) =>
        Promise.resolve({
          _id: '507f1f77bcf86cd799439066',
          ...data
        })
      );

      const res = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'AC Broken in Room 604',
          category: 'Classroom Infrastructure',
          description: 'AC 2 is blowing hot air continuously.',
          locationRoom: 'Room 604',
          isAnonymous: true
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ticketId).toMatch(/^CU-TICK-\d{4}$/);
      expect(res.body.data.submittedBy).toBeNull();
    });

    it('GET /api/complaints/track/:ticketId should be publicly accessible', async () => {
      (Complaint.findOne as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({
          ticketId: 'CU-TICK-1001',
          title: 'AC Broken',
          category: 'Classroom Infrastructure',
          locationRoom: 'Room 604',
          status: 'UNDER_REVIEW',
          adminRemarks: 'Assigned to engineering crew.',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      });

      const res = await request(app).get('/api/complaints/track/CU-TICK-1001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ticketId).toBe('CU-TICK-1001');
      expect(res.body.data.submittedBy).toBeUndefined();
    });

    it('PATCH /api/complaints/:id/status should update status when performed by admin', async () => {
      const mockUpdated = {
        _id: '507f1f77bcf86cd799439066',
        ticketId: 'CU-TICK-1001',
        status: 'ACTION_TAKEN',
        adminRemarks: 'Repaired by engineering.',
        populate: jest.fn().mockResolvedValueOnce({
          _id: '507f1f77bcf86cd799439066',
          status: 'ACTION_TAKEN'
        })
      };

      (Complaint.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(mockUpdated)
      });

      const res = await request(app)
        .patch('/api/complaints/507f1f77bcf86cd799439066/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'ACTION_TAKEN',
          adminRemarks: 'Repaired by engineering.'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
