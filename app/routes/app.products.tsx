/**
 * Cartlight: ChatGPT Ads HQ — Products Page
 * Cartlight Labs (c) 2026.
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { MetricCard } from "../components/MetricCard";
import { EmptyStatePlaceholder } from "../components/EmptyStatePlaceholder";
import { syncShopFromAdmin } from "../services/shop.server";
import { db } from "../db/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const { totalProducts } = await syncShopFromAdmin(admin, session.shop);
  const shop = await db.shop.findUnique({
    where: { shopifyDomain: session.shop },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const count = totalProducts ?? shop?._count.products ?? 0;

  return {
    totalProducts: count,
    syncedProducts: 0,
    pendingProducts: 0,
    excludedProducts: 0,
  };
};

export default function ProductsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <s-page heading="Products">
      <s-button slot="primary-action" href="/app/settings">
        Sync Catalog
      </s-button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "16px",
          marginBottom: "20px",
        }}
      >
        <MetricCard
          title="Total Catalog"
          value={String(data.totalProducts)}
          subtitle="Shopify items discovered"
        />
        <MetricCard
          title="Synced to ChatGPT"
          value={String(data.syncedProducts)}
          subtitle="Active in AI product feed"
        />
        <MetricCard
          title="Pending Sync"
          value={String(data.pendingProducts)}
          subtitle="Awaiting feed refresh"
        />
        <MetricCard
          title="Excluded"
          value={String(data.excludedProducts)}
          subtitle="Excluded by rule"
        />
      </div>

      <s-section heading="Product Feed Status">
        <EmptyStatePlaceholder
          icon="📦"
          title="Product Feed Ready to Initialize"
          description="Synchronize your Shopify catalog with Cartlight to prepare your products for ChatGPT organic recommendations and paid shopping placements."
          actionLabel="Initialize Product Sync"
          actionHref="/app/settings"
        />
      </s-section>

      <s-section slot="aside" heading="Feed Optimization Tips">
        <s-paragraph>
          Ensure products have detailed descriptions, high-resolution imagery, and accurate inventory counts to maximize AI recommendation relevance in ChatGPT answers.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
