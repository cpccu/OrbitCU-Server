import { FilterQuery, Types } from 'mongoose';
import { Event } from './event.model';
import { RSVP } from './rsvp.model';
import { IEventDocument, IRSVPDocument } from './event.interface';
import { CreateEventInput, EventFilterQuery } from './event.types';
import { AppError } from '../../utils/AppError';
import { calculatePagination, getPaginationMeta } from '../../utils/pagination';
import { generateTicketHash } from '../../utils/crypto';
import { MESSAGES } from '../../constants/messages';

export const getAllEvents = async (query: EventFilterQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination({
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    sortBy: 'eventDate',
    sortOrder: 'asc'
  });

  const filter: FilterQuery<IEventDocument> = {};

  if (query.category) {
    filter.category = query.category;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (query.timeFrame === 'upcoming') {
    filter.eventDate = { $gte: startOfToday };
  } else if (query.timeFrame === 'today') {
    filter.eventDate = { $gte: startOfToday, $lte: endOfToday };
  } else if (query.timeFrame === 'past') {
    filter.eventDate = { $lt: startOfToday };
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { clubName: searchRegex },
      { description: searchRegex }
    ];
  }

  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email universityId department'),
    Event.countDocuments(filter)
  ]);

  return {
    events,
    meta: getPaginationMeta(total, page, limit)
  };
};

export const getEventById = async (eventId: string): Promise<IEventDocument> => {
  const event = await Event.findById(eventId).populate(
    'createdBy',
    'name email universityId department'
  );
  if (!event) {
    throw new AppError(MESSAGES.EVENT.NOT_FOUND, 404);
  }
  return event;
};

export const createEvent = async (
  payload: CreateEventInput,
  userId: string
): Promise<IEventDocument> => {
  const eventDate = new Date(payload.eventDate);
  const registrationDeadline = new Date(payload.registrationDeadline);

  if (registrationDeadline.getTime() >= eventDate.getTime()) {
    throw new AppError(MESSAGES.EVENT.INVALID_DEADLINE, 400);
  }

  const event = await Event.create({
    ...payload,
    eventDate,
    registrationDeadline,
    createdBy: new Types.ObjectId(userId)
  });

  return event;
};

export const rsvpForEvent = async (
  eventId: string,
  userId: string,
  universityId: string
): Promise<IRSVPDocument> => {
  // Check if event exists
  const existingEvent = await Event.findById(eventId);
  if (!existingEvent) {
    throw new AppError(MESSAGES.EVENT.NOT_FOUND, 404);
  }

  // Check if deadline has passed
  if (new Date().getTime() > existingEvent.registrationDeadline.getTime()) {
    throw new AppError(MESSAGES.EVENT.DEADLINE_PASSED, 400);
  }

  // Check for prior RSVP
  const existingRSVP = await RSVP.findOne({
    eventId: new Types.ObjectId(eventId),
    studentId: new Types.ObjectId(userId)
  });
  if (existingRSVP) {
    throw new AppError(MESSAGES.EVENT.ALREADY_RSVP, 409);
  }

  // Atomically check registeredCount < maxCapacity and increment
  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: new Types.ObjectId(eventId),
      $expr: { $lt: ['$registeredCount', '$maxCapacity'] }
    },
    {
      $inc: { registeredCount: 1 }
    },
    {
      new: true
    }
  );

  if (!updatedEvent) {
    throw new AppError(MESSAGES.EVENT.EVENT_FULL, 400);
  }

  try {
    const ticketHash = generateTicketHash();
    const rsvp = await RSVP.create({
      eventId: updatedEvent._id,
      studentId: new Types.ObjectId(userId),
      studentUniversityId: universityId,
      ticketHash,
      registrationDate: new Date()
    });

    return await rsvp.populate('eventId');
  } catch (err: any) {
    // If ticket creation failed (e.g. duplicate key race condition), rollback registeredCount
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
    if (err.code === 11000) {
      throw new AppError(MESSAGES.EVENT.ALREADY_RSVP, 409);
    }
    throw err;
  }
};

export const getMyPasses = async (userId: string): Promise<IRSVPDocument[]> => {
  const passes = await RSVP.find({ studentId: new Types.ObjectId(userId) })
    .sort({ registrationDate: -1 })
    .populate({
      path: 'eventId',
      populate: {
        path: 'createdBy',
        select: 'name email department'
      }
    });

  return passes;
};
