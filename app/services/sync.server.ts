/**
 * Cartlight: ChatGPT Ads HQ
 * Sync Pipeline Service Scaffolding (Phase 0 Foundation)
 * Full sync execution will be implemented in Phase 1+.
 * Cartlight Labs (c) 2026.
 */

import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";

export type SyncType = "PRODUCTS" | "METRICS" | "CAMPAIGNS" | "FULL";
export type SyncStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";

export interface SyncRunSummary {
  id: string;
  syncType: string;
  status: string;
  itemsTotal: number;
  itemsProcessed: number;
  itemsFailed: number;
  startedAt: Date;
  completedAt: Date | null;
}

export async function getRecentSyncRuns(shopId: string, limit = 5): Promise<SyncRunSummary[]> {
  try {
    return await db.syncRun.findMany({
      where: { shopId },
      orderBy: { startedAt: "desc" },
      take: limit,
      select: {
        id: true,
        syncType: true,
        status: true,
        itemsTotal: true,
        itemsProcessed: true,
        itemsFailed: true,
        startedAt: true,
        completedAt: true,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch recent sync runs", error, { shopId });
    return [];
  }
}

export async function createSyncRun(shopId: string, syncType: SyncType) {
  try {
    return await db.syncRun.create({
      data: {
        shopId,
        syncType,
        status: "PENDING",
      },
    });
  } catch (error) {
    logger.error("Failed to initialize sync run", error, { shopId, syncType });
    throw error;
  }
}
