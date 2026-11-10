/**
 * Cartlight: ChatGPT Ads HQ
 * Shop Domain Service
 * Cartlight Labs (c) 2026.
 */

import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";

export interface ShopRegistrationData {
  shopifyShopId?: string | null;
  name?: string | null;
  email?: string | null;
  currency?: string;
  country?: string | null;
  ianaTimezone?: string;
}

export async function findOrCreateShop(
  shopifyDomain: string,
  data?: ShopRegistrationData
) {
  try {
    const shop = await db.shop.upsert({
      where: { shopifyDomain },
      update: {
        isActive: true,
        uninstalledAt: null,
        lastConnectedAt: new Date(),
        ...(data?.shopifyShopId !== undefined ? { shopifyShopId: data.shopifyShopId } : {}),
        ...(data?.name !== undefined ? { name: data.name } : {}),
        ...(data?.email !== undefined ? { email: data.email } : {}),
        ...(data?.currency ? { currency: data.currency } : {}),
        ...(data?.country !== undefined ? { country: data.country } : {}),
        ...(data?.ianaTimezone ? { ianaTimezone: data.ianaTimezone } : {}),
      },
      create: {
        shopifyDomain,
        shopifyShopId: data?.shopifyShopId || null,
        name: data?.name || null,
        email: data?.email || null,
        currency: data?.currency || "USD",
        country: data?.country || null,
        ianaTimezone: data?.ianaTimezone || "UTC",
        isActive: true,
        lastConnectedAt: new Date(),
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

export async function syncShopFromAdmin(
  admin: { graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response> },
  shopifyDomain: string
) {
  let shopData: ShopRegistrationData = {};
  let totalProducts: number | null = null;

  try {
    const SHOP_METADATA_QUERY = `#graphql
      query getShopMetadata {
        shop {
          id
          name
          email
          currencyCode
          billingAddress {
            countryCodeV2
          }
          ianaTimezone
        }
        productsCount {
          count
        }
      }
    `;

    const response = await admin.graphql(SHOP_METADATA_QUERY);
    const json = (await response.json()) as {
      data?: {
        shop?: {
          id?: string;
          name?: string;
          email?: string;
          currencyCode?: string;
          billingAddress?: {
            countryCodeV2?: string;
          };
          ianaTimezone?: string;
        };
        productsCount?: {
          count?: number;
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (json.data?.shop) {
      const s = json.data.shop;
      shopData = {
        shopifyShopId: s.id || null,
        name: s.name || null,
        email: s.email || null,
        currency: s.currencyCode || "USD",
        country: s.billingAddress?.countryCodeV2 || null,
        ianaTimezone: s.ianaTimezone || "UTC",
      };
    }

    if (typeof json.data?.productsCount?.count === "number") {
      totalProducts = json.data.productsCount.count;
    }
  } catch (error) {
    logger.warn("Could not query Shopify Admin GraphQL for shop metadata, proceeding with basic registration", {
      shop: shopifyDomain,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const shop = await findOrCreateShop(shopifyDomain, shopData);
  return { shop, totalProducts };
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
