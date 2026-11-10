/**
 * Cartlight: ChatGPT Ads HQ — Profitability Page
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

export default function ProfitabilityPage() {
  return (
    <s-page heading="Profitability">
      <s-banner tone="info" heading="Real-Time Profitability Engine">
        <s-paragraph>
          Cartlight correlates ChatGPT ad spend directly against your Shopify order COGS, merchant transaction fees, and shipping costs to calculate real net profit.
        </s-paragraph>
      </s-banner>

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
          title="Net Profit"
          value={formatCurrency(0)}
          subtitle="Revenue minus (Ad Spend + COGS)"
        />
        <MetricCard
          title="Gross Margin"
          value="0.0%"
          subtitle="Pre-ad profit margin"
        />
        <MetricCard
          title="Contribution Margin"
          value="0.0%"
          subtitle="Post-ad profit margin"
        />
        <MetricCard
          title="Effective CPA"
          value={formatCurrency(0)}
          subtitle="Cost per acquisition"
        />
      </div>

      <s-section heading="Profit Breakdown">
        <EmptyStatePlaceholder
          icon="📊"
          title="No Profitability Data Recorded Yet"
          description="Profit calculations will automatically populate once your first ChatGPT advertising campaign begins driving storefront visits and orders."
          actionLabel="Configure Margin Guardrails"
          actionHref="/app/settings"
        />
      </s-section>

      <s-section slot="aside" heading="Profitability Metrics Guide">
        <s-paragraph>
          <strong>Net Profit:</strong> Total ChatGPT order revenue minus COGS, shipping, transaction fees, and ad spend.
        </s-paragraph>
        <s-paragraph>
          <strong>ROAS vs Profit:</strong> High ROAS does not always mean positive margin. Cartlight prevents unprofitable scaling.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
