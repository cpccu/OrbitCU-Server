import crypto from 'crypto';

/**
 * Generate a cryptographically secure random ticket hash
 */
export const generateTicketHash = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Generate a random 4-digit ticket ID formatted as CU-TICK-XXXX
 */
export const generateComplaintTicketId = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `CU-TICK-${randomDigits}`;
};
