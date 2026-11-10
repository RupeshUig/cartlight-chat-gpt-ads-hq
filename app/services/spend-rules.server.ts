/**
 * Cartlight: ChatGPT Ads HQ
 * Spend Rules Service Scaffolding (Phase 0 Foundation)
 * Automated rule execution is reserved for Phase 2+.
 * Cartlight Labs (c) 2026.
 */

import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";

export interface SpendRuleSummary {
  id: string;
  name: string;
  description: string | null;
  ruleType: string;
  isActive: boolean;
  triggerCount: number;
  lastTriggeredAt: Date | null;
}

export async function listShopSpendRules(shopId: string): Promise<SpendRuleSummary[]> {
  try {
    return await db.spendRule.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        ruleType: true,
        isActive: true,
        triggerCount: true,
        lastTriggeredAt: true,
      },
    });
  } catch (error) {
    logger.error("Failed to list spend rules", error, { shopId });
    return [];
  }
}
