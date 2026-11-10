/**
 * Cartlight: ChatGPT Ads HQ
 * Shopify GraphQL Admin API Utilities
 * Cartlight Labs (c) 2026.
 */

import { logger } from "../../utils/logger.server";

export async function executeGraphQL<T = unknown>(
  admin: { graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response> },
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const response = await admin.graphql(query, { variables });
    const json = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };

    if (json.errors && json.errors.length > 0) {
      const errorMessage = json.errors.map((e) => e.message).join(", ");
      logger.error("Shopify GraphQL execution returned errors", undefined, { errors: json.errors });
      throw new Error(`[Shopify GraphQL Error] ${errorMessage}`);
    }

    if (!json.data) {
      throw new Error("[Shopify GraphQL Error] No data returned from GraphQL response");
    }

    return json.data;
  } catch (error) {
    logger.error("Failed to execute Shopify GraphQL query", error);
    throw error;
  }
}
