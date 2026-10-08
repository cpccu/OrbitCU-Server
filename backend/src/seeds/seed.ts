import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../modules/auth/auth.model';
import { Event } from '../modules/event/event.model';
import { RSVP } from '../modules/event/rsvp.model';
import { Resource } from '../modules/resource/resource.model';
import { FAQ } from '../modules/helpdesk/helpdesk.model';
import { LostFound } from '../modules/lost-found/lost-found.model';
import { Complaint } from '../modules/complaint/complaint.model';
import { logger } from '../utils/logger';
import { generateTicketHash } from '../utils/crypto';

export const seedDatabase = async () => {
  logger.info('🌱 Starting database seeding for CampusOS — City University Hub...');

  try {
    // 1. Clear existing collections (Idempotency)
    logger.info('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      RSVP.deleteMany({}),
      Resource.deleteMany({}),
      FAQ.deleteMany({}),
      LostFound.deleteMany({}),
      Complaint.deleteMany({})
    ]);

    // 2. Seed Users
    logger.info('👤 Seeding Users...');
    const studentUser = await User.create({
      name: 'Tanvir Ahmed',
      universityId: '2021-1-60-001',
      email: 'student@city.edu',
      password: 'password123',
      department: 'CSE',
      role: 'STUDENT'
    });

    const clubUser = await User.create({
      name: 'Nusrat Jahan',
      universityId: '2020-2-50-012',
      email: 'club@city.edu',
      password: 'password123',
      department: 'BBA',
      role: 'CLUB_ADMIN'
    });

    const adminUser = await User.create({
      name: 'Prof. Dr. M. Rahman',
      universityId: 'ADMIN-001',
      email: 'admin@city.edu',
      password: 'admin123',
      department: 'CSE',
      role: 'UNIVERSITY_ADMIN'
    });

    // 3. Seed Events
    logger.info('🎪 Seeding Events...');
    const eventDate1 = new Date();
    eventDate1.setDate(eventDate1.getDate() + 15);
    const deadline1 = new Date(eventDate1);
    deadline1.setDate(deadline1.getDate() - 3);

    const eventDate2 = new Date();
    eventDate2.setDate(eventDate2.getDate() + 25);
    const deadline2 = new Date(eventDate2);
    deadline2.setDate(deadline2.getDate() - 4);

    const event1 = await Event.create({
      title: 'CU Intra-University Programming Contest 2026',
      clubName: 'CU Computer Club',
      category: 'Technical',
      description:
        'The premier competitive programming showdown for all undergraduate batches at City University. Test your algorithmic prowess on ACM-ICPC style problem sets.',
      bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      venue: 'Lab 4 & 5, Academic Building 2',
      eventDate: eventDate1,
      registrationDeadline: deadline1,
      maxCapacity: 120,
      registeredCount: 1,
      isInterUniversity: false,
      createdBy: clubUser._id
    });

    const event2 = await Event.create({
      title: 'National Debate Championship Selection Round',
      clubName: 'CU Debating Society',
      category: 'Debate',
      description:
        'Annual parliamentary debate tryouts to represent City University at national circuits. Topics span public policy, technology, and economic justice.',
      bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
      venue: 'Central Auditorium',
      eventDate: eventDate2,
      registrationDeadline: deadline2,
      maxCapacity: 80,
      registeredCount: 0,
      isInterUniversity: false,
      createdBy: adminUser._id
    });

    // Seed Sample RSVP
    await RSVP.create({
      eventId: event1._id,
      studentId: studentUser._id,
      studentUniversityId: studentUser.universityId,
      ticketHash: generateTicketHash(),
      registrationDate: new Date()
    });

    // 4. Seed Resources
    logger.info('📚 Seeding Resources...');
    await Resource.create([
      {
        title: 'CSE-221 Algorithms Mid-Term Question Paper (Fall 2024)',
        courseCode: 'CSE-221',
        courseTitle: 'Algorithms & Complexity Analysis',
        department: 'CSE',
        semesterTerm: 'Mid-Term',
        academicSession: 'Fall 2024',
        fileUrl: 'https://assets.city.edu/resources/cse-221-mid-fall2024.pdf',
        fileFormat: 'PDF',
        uploadedBy: studentUser._id,
        upvotes: 42
      },
      {
        title: 'EEE-163 Circuit Analysis Lab Manual',
        courseCode: 'EEE-163',
        courseTitle: 'Electrical Circuits Laboratory',
        department: 'EEE',
        semesterTerm: 'Lab Manual',
        academicSession: 'Spring 2025',
        fileUrl: 'https://assets.city.edu/resources/eee-163-lab-manual.pdf',
        fileFormat: 'PDF',
        uploadedBy: adminUser._id,
        upvotes: 28
      }
    ]);

    // 5. Seed FAQs
    logger.info('❓ Seeding FAQs...');
    await FAQ.create([
      {
        question: 'What is the policy for course retake / improvement?',
        answer:
          'Students with grades of B- (2.75) or below can apply for course retake within the first two weeks of the following semester. The higher grade obtained replaces previous credits in CGPA calculations up to a maximum limit of 4 retakes.',
        category: 'Examinations & Grading',
        isPinned: true,
        referenceUrl: 'https://city.edu/academics/grading-regulations',
        updatedBy: adminUser._id
      },
      {
        question: 'What are the eligibility criteria for merit-based tuition waivers?',
        answer:
          'Undergraduate students enrolled in at least 12 credits who achieve a semester GPA of 3.85 or higher without any incomplete/retake status qualify for a 20% to 100% tuition fee waiver, reviewed semesterly by the Academic Council.',
        category: 'Accounts & Waivers',
        isPinned: true,
        referenceUrl: 'https://city.edu/waivers/merit-policy',
        updatedBy: adminUser._id
      }
    ]);

    // 6. Seed Lost & Found
    logger.info('🔍 Seeding Lost & Found...');
    const incidentDate1 = new Date();
    incidentDate1.setDate(incidentDate1.getDate() - 2);

    const incidentDate2 = new Date();
    incidentDate2.setDate(incidentDate2.getDate() - 1);

    await LostFound.create([
      {
        type: 'LOST',
        title: 'Casio FX-991EX ClassWiz Calculator',
        category: 'Calculator',
        locationFoundOrLost: 'Room 402, Academic Building 1',
        dateOfIncident: incidentDate1,
        description: 'Black solar calculator with transparent protective slide cover left during CSE-111 exam.',
        imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd',
        status: 'OPEN',
        contactNumberOrEmail: '+8801700112233',
        reporterId: studentUser._id
      },
      {
        type: 'FOUND',
        title: 'Student ID Card: 2022-1-60-142',
        category: 'ID Card',
        locationFoundOrLost: 'Canteen Ground Floor near water dispenser',
        dateOfIncident: incidentDate2,
        description: 'Found plastic student ID card belonging to Department of CSE. Handed over to student affairs desk.',
        imageUrl: '',
        status: 'OPEN',
        contactNumberOrEmail: 'studentaffairs@city.edu',
        reporterId: clubUser._id
      }
    ]);

    // 7. Seed Complaints
    logger.info('📢 Seeding Complaints...');
    await Complaint.create([
      {
        ticketId: 'CU-TICK-1001',
        title: 'AC Unit 2 Not Cooling',
        category: 'Classroom Infrastructure',
        description: 'The ceiling AC unit 2 in Room 604 is blowing warm air, making afternoon lectures uncomfortable.',
        locationRoom: 'Room 604',
        isAnonymous: false,
        submittedBy: studentUser._id,
        status: 'UNDER_REVIEW',
        adminRemarks: 'Work order dispatched to campus engineering department.'
      },
      {
        ticketId: 'CU-TICK-1002',
        title: 'Projector HDMI Port Damaged',
        category: 'Lab Equipment',
        description: 'Main ceiling projector has bent HDMI connector pins and loses signal intermittently.',
        locationRoom: 'Lab 2',
        isAnonymous: true,
        submittedBy: null,
        status: 'ACTION_TAKEN',
        adminRemarks: 'Replacement HDMI cable and transceiver installed.'
      }
    ]);

    logger.info('✅ Database seeding finished successfully!');
  } catch (error) {
    logger.error('❌ Seeding failed with error:', error);
    throw error;
  }
};

// Standalone execution wrapper
if (require.main === module) {
  (async () => {
    try {
      await connectDatabase();
      await seedDatabase();
      await disconnectDatabase();
      process.exit(0);
    } catch (err) {
      logger.error('Fatal error in seeding script:', err);
      process.exit(1);
    }
  })();
}
