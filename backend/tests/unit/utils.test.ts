import { AppError } from '../../src/utils/AppError';
import { generateTicketHash, generateComplaintTicketId } from '../../src/utils/crypto';
import { calculatePagination, getPaginationMeta } from '../../src/utils/pagination';
import { PATTERNS } from '../../src/constants/enums';

describe('Unit Tests: Utilities', () => {
  describe('AppError', () => {
    it('should create an operational error with proper status code and status string', () => {
      const err400 = new AppError('Bad request', 400);
      expect(err400.statusCode).toBe(400);
      expect(err400.status).toBe('fail');
      expect(err400.isOperational).toBe(true);

      const err500 = new AppError('Server error', 500);
      expect(err500.statusCode).toBe(500);
      expect(err500.status).toBe('error');
    });
  });

  describe('Crypto Utilities', () => {
    it('should generate a 32-character hex ticket hash', () => {
      const hash1 = generateTicketHash();
      const hash2 = generateTicketHash();

      expect(hash1).toHaveLength(32);
      expect(hash2).toHaveLength(32);
      expect(hash1).not.toBe(hash2);
    });

    it('should generate complaint ticket ID matching CU-TICK-XXXX format', () => {
      const ticketId = generateComplaintTicketId();
      expect(PATTERNS.TICKET_ID.test(ticketId)).toBe(true);
      expect(ticketId.startsWith('CU-TICK-')).toBe(true);
    });
  });

  describe('Pagination Utilities', () => {
    it('should calculate offset and limits correctly', () => {
      const result = calculatePagination({ page: 2, limit: 15 });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(15);
      expect(result.skip).toBe(15);
    });

    it('should provide accurate pagination meta', () => {
      const meta = getPaginationMeta(45, 1, 10);
      expect(meta.total).toBe(45);
      expect(meta.totalPages).toBe(5);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(false);
    });
  });
});
