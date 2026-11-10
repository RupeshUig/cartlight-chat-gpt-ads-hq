/**
 * Cartlight: ChatGPT Ads HQ
 * Alerts Service Scaffolding (Phase 0 Foundation)
 * Cartlight Labs (c) 2026.
 */

import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";

export interface CreateAlertInput {
  shopId: string;
  title: string;
  message: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
  type: "BUDGET_EXCEEDED" | "SYNC_FAILURE" | "DISCONNECTED_ACCOUNT" | "ANOMALY" | "GENERAL";
}

export async function listActiveAlerts(shopId: string) {
  try {
    return await db.alert.findMany({
      where: {
        shopId,
        isDismissed: false,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch (error) {
    logger.error("Failed to list active alerts", error, { shopId });
    return [];
  }
}

export async function createAlert(input: CreateAlertInput) {
  try {
    return await db.alert.create({
      data: {
        shopId: input.shopId,
        title: input.title,
        message: input.message,
        severity: input.severity || "INFO",
        type: input.type,
      },
    });
  } catch (error) {
    logger.error("Failed to create alert", error, { shopId: input.shopId });
    throw error;
  }
}

export async function dismissAlert(alertId: string, shopId: string) {
  try {
    return await db.alert.updateMany({
      where: { id: alertId, shopId },
      data: { isDismissed: true, dismissedAt: new Date() },
    });
  } catch (error) {
    logger.error("Failed to dismiss alert", error, { alertId, shopId });
    throw error;
  }
}
