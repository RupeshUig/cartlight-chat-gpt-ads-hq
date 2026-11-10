/**
 * Cartlight: ChatGPT Ads HQ
 * Shop Domain Service
 * Cartlight Labs (c) 2026.
 */

import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";

export async function findOrCreateShop(shopifyDomain: string, initialData?: { name?: string; email?: string; currency?: string; timezone?: string }) {
  try {
    const shop = await db.shop.upsert({
      where: { shopifyDomain },
      update: {
        isActive: true,
        uninstalledAt: null,
        ...(initialData?.name ? { name: initialData.name } : {}),
        ...(initialData?.email ? { email: initialData.email } : {}),
        ...(initialData?.currency ? { currency: initialData.currency } : {}),
        ...(initialData?.timezone ? { ianaTimezone: initialData.timezone } : {}),
      },
      create: {
        shopifyDomain,
        name: initialData?.name,
        email: initialData?.email,
        currency: initialData?.currency || "USD",
        ianaTimezone: initialData?.timezone || "UTC",
        isActive: true,
      },
      include: {
        openAIConnection: true,
      },
    });

    return shop;
  } catch (error) {
    logger.error("Failed to find or create shop", error, { shop: shopifyDomain });
    throw error;
  }
}

export async function getShopOverview(shopifyDomain: string) {
  try {
    const shop = await db.shop.findUnique({
      where: { shopifyDomain },
      include: {
        openAIConnection: true,
        _count: {
          select: {
            products: true,
            alerts: { where: { isDismissed: false } },
            spendRules: { where: { isActive: true } },
            syncRuns: true,
          },
        },
      },
    });

    return shop;
  } catch (error) {
    logger.error("Failed to fetch shop overview", error, { shop: shopifyDomain });
    return null;
  }
}
