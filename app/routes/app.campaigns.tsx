/**
 * Cartlight: ChatGPT Ads HQ — Campaigns Page
 * Cartlight Labs (c) 2026.
 */

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { MetricCard } from "../components/MetricCard";
import { EmptyStatePlaceholder } from "../components/EmptyStatePlaceholder";
import { formatCurrency } from "../utils/formatting";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function CampaignsPage() {
  return (
    <s-page heading="Campaigns">
      <s-button slot="primary-action" href="/app/settings">
        New Campaign
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
          title="Active Campaigns"
          value="0"
          subtitle="ChatGPT placements"
        />
        <MetricCard
          title="Daily Budget Allocated"
          value={formatCurrency(0)}
          subtitle="Across all active sets"
        />
        <MetricCard
          title="Total Impressions"
          value="0"
          subtitle="Conversational views"
        />
        <MetricCard
          title="Click-Through Rate"
          value="0.0%"
          subtitle="Blended CTR"
        />
      </div>

      <s-section heading="ChatGPT Ad Campaigns">
        <EmptyStatePlaceholder
          icon="🚀"
          title="No Active ChatGPT Campaigns"
          description="Build high-intent conversational ad campaigns that showcase your Shopify products directly in ChatGPT search and chat responses."
          actionLabel="Connect OpenAI Ads Account"
          actionHref="/app/settings"
        />
      </s-section>

      <s-section slot="aside" heading="Campaign Strategies">
        <s-paragraph>
          <strong>Search Intent Targeting:</strong> Match products to users actively asking ChatGPT for buying advice, comparisons, and product recommendations.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
