/**
 * Cartlight: ChatGPT Ads HQ
 * Shopify Admin Products API Service Scaffolding
 * Cartlight Labs (c) 2026.
 */

import { executeGraphQL } from "./graphql.server";

export interface ShopifyProductItem {
  id: string;
  title: string;
  handle: string;
  status: string;
  totalInventory?: number;
}

const PRODUCTS_QUERY = `#graphql
  query getProductsCatalog($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          status
          totalInventory
        }
      }
    }
  }
`;

export async function fetchShopifyProducts(
  admin: { graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response> },
  first = 25
): Promise<ShopifyProductItem[]> {
  interface QueryResult {
    products: {
      edges: Array<{
        node: ShopifyProductItem;
      }>;
    };
  }

  const data = await executeGraphQL<QueryResult>(admin, PRODUCTS_QUERY, { first });
  return data.products.edges.map((edge) => edge.node);
}
