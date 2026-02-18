/**
 * Loads .env.local for standalone scripts (e.g., seed.ts).
 * Import this as the FIRST import in any script that runs outside Next.js.
 */
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });
