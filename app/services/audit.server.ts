/**
 * Cartlight: ChatGPT Ads HQ
 * Security & Compliance Audit Service
 * Cartlight Labs (c) 2026.
 */

import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";

export interface LogAuditInput {
  shopId: string;
  actor: "SYSTEM" | "USER" | "SHOPIFY_WEBHOOK" | "OPENAI_SYNC";
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown> | string;
  ipAddress?: string;
}

export async function logAuditEvent(input: LogAuditInput) {
  try {
    const detailsString =
      typeof input.details === "object"
        ? JSON.stringify(input.details)
        : input.details;

    return await db.auditLog.create({
      data: {
        shopId: input.shopId,
        actor: input.actor,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        details: detailsString,
        ipAddress: input.ipAddress,
      },
    });
  } catch (error) {
    logger.error("Failed to write audit log entry", error, { shopId: input.shopId, action: input.action });
    return null;
  }
}
