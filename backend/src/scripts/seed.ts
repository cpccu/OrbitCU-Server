import { seedDatabase } from '../seeds/seed';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../utils/logger';

export const runSeed = async () => {
  try {
    await connectDatabase();
    await seedDatabase();
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error running seed script:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeed();
}
