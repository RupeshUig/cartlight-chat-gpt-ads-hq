/**
 * Cartlight: ChatGPT Ads HQ
 * Prisma Client Singleton & Database Access Layer
 * Cartlight Labs (c) 2026.
 */

import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.server";

declare global {
  // eslint-disable-next-line no-var
  var __cartlightPrismaGlobal: PrismaClient | undefined;
}

let dbInstance: PrismaClient;

if (process.env.NODE_ENV === "production") {
  dbInstance = new PrismaClient({
    log: ["error", "warn"],
  });
} else {
  if (!global.__cartlightPrismaGlobal) {
    global.__cartlightPrismaGlobal = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  dbInstance = global.__cartlightPrismaGlobal;
}

/**
 * Health check helper for database connection.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await dbInstance.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error("Database connection check failed", error);
    return false;
  }
}

export const db = dbInstance;
export default dbInstance;
