import * as eventService from '../../src/modules/event/event.service';
import { Event } from '../../src/modules/event/event.model';
import { RSVP } from '../../src/modules/event/rsvp.model';
import { AppError } from '../../src/utils/AppError';

jest.mock('../../src/modules/event/event.model');
jest.mock('../../src/modules/event/rsvp.model');

describe('Unit Tests: Event Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should throw 400 if registrationDeadline >= eventDate', async () => {
      const eventDate = new Date('2026-10-10');
      const registrationDeadline = new Date('2026-10-12');

      await expect(
        eventService.createEvent(
          {
            title: 'Contest',
            clubName: 'Club',
            category: 'Technical',
            description: 'Description here',
            bannerUrl: 'https://example.com/banner.jpg',
            venue: 'Lab 4',
            eventDate,
            registrationDeadline,
            maxCapacity: 100
          },
          '507f1f77bcf86cd799439011'
        )
      ).rejects.toThrow(AppError);
    });

    it('should create event successfully when registrationDeadline < eventDate', async () => {
      const eventDate = new Date('2026-10-20');
      const registrationDeadline = new Date('2026-10-15');

      (Event.create as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439022',
        title: 'Contest',
        eventDate,
        registrationDeadline
      });

      const result = await eventService.createEvent(
        {
          title: 'Contest',
          clubName: 'Club',
          category: 'Technical',
          description: 'Description here',
          bannerUrl: 'https://example.com/banner.jpg',
          venue: 'Lab 4',
          eventDate,
          registrationDeadline,
          maxCapacity: 100
        },
        '507f1f77bcf86cd799439011'
      );

      expect(result._id).toBe('507f1f77bcf86cd799439022');
    });
  });

  describe('rsvpForEvent', () => {
    it('should throw 404 if event does not exist', async () => {
      (Event.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        eventService.rsvpForEvent(
          '507f1f77bcf86cd799439022',
          '507f1f77bcf86cd799439011',
          '2021-1-60-001'
        )
      ).rejects.toThrow(AppError);
    });

    it('should throw 400 if registration deadline has passed', async () => {
      (Event.findById as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439022',
        registrationDeadline: new Date(Date.now() - 10000)
      });

      await expect(
        eventService.rsvpForEvent(
          '507f1f77bcf86cd799439022',
          '507f1f77bcf86cd799439011',
          '2021-1-60-001'
        )
      ).rejects.toThrow(AppError);
    });

    it('should throw 409 if student already RSVPd', async () => {
      (Event.findById as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439022',
        registrationDeadline: new Date(Date.now() + 1000000)
      });

      (RSVP.findOne as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439033'
      });

      await expect(
        eventService.rsvpForEvent(
          '507f1f77bcf86cd799439022',
          '507f1f77bcf86cd799439011',
          '2021-1-60-001'
        )
      ).rejects.toThrow(AppError);
    });

    it('should throw 400 if event is at capacity', async () => {
      (Event.findById as jest.Mock).mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439022',
        registrationDeadline: new Date(Date.now() + 1000000)
      });

      (RSVP.findOne as jest.Mock).mockResolvedValueOnce(null);
      (Event.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null); // atomic increment failed due to capacity

      await expect(
        eventService.rsvpForEvent(
          '507f1f77bcf86cd799439022',
          '507f1f77bcf86cd799439011',
          '2021-1-60-001'
        )
      ).rejects.toThrow(AppError);
    });
  });
});
