export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    TOKEN_EXPIRED: 'Authentication token has expired',
    TOKEN_INVALID: 'Invalid authentication token',
    FORBIDDEN: 'You do not have permission to perform this action',
    EMAIL_EXISTS: 'An account with this email already exists',
    STUDENT_ID_EXISTS: 'An account with this university ID already exists'
  },
  EVENT: {
    CREATED: 'Event created successfully',
    FETCHED_ALL: 'Events retrieved successfully',
    FETCHED_ONE: 'Event retrieved successfully',
    NOT_FOUND: 'Event not found',
    RSVP_SUCCESS: 'RSVP confirmed successfully',
    ALREADY_RSVP: 'You have already registered for this event',
    EVENT_FULL: 'Event has reached maximum capacity',
    DEADLINE_PASSED: 'Registration deadline has passed',
    INVALID_DEADLINE: 'Registration deadline must be before the event date',
    PASSES_FETCHED: 'My passes retrieved successfully'
  },
  RESOURCE: {
    CREATED: 'Resource uploaded successfully',
    FETCHED_ALL: 'Resources retrieved successfully',
    FETCHED_ONE: 'Resource retrieved successfully',
    SEARCH_SUCCESS: 'Resources searched successfully',
    NOT_FOUND: 'Resource not found',
    UPVOTED: 'Resource upvoted successfully'
  },
  HELPDESK: {
    CREATED: 'FAQ created successfully',
    FETCHED_ALL: 'FAQs retrieved successfully',
    FETCHED_ONE: 'FAQ retrieved successfully',
    UPDATED: 'FAQ updated successfully',
    DELETED: 'FAQ deleted successfully',
    NOT_FOUND: 'FAQ item not found'
  },
  LOST_FOUND: {
    CREATED: 'Lost/Found item reported successfully',
    FETCHED_ALL: 'Lost/Found listings retrieved successfully',
    FETCHED_ONE: 'Lost/Found item retrieved successfully',
    RESOLVED: 'Item status updated to resolved',
    NOT_FOUND: 'Lost/Found item not found',
    UNAUTHORIZED_RESOLVE: 'Only the reporter or a university administrator can resolve this item'
  },
  COMPLAINT: {
    CREATED: 'Complaint submitted successfully',
    TRACK_FETCHED: 'Complaint status retrieved successfully',
    FETCHED_MY: 'My complaints retrieved successfully',
    FETCHED_ALL: 'Complaints retrieved successfully',
    STATUS_UPDATED: 'Complaint status updated successfully',
    NOT_FOUND: 'Complaint ticket not found'
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error occurred',
    VALIDATION_ERROR: 'Validation error',
    NOT_FOUND: 'Requested resource was not found on this server',
    RATE_LIMIT: 'Too many requests from this IP, please try again later'
  }
} as const;
