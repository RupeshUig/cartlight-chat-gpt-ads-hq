/**
 * Cartlight: ChatGPT Ads HQ — Overview Dashboard
 * Cartlight Labs (c) 2026.
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";
import { getShopOverview } from "../services/shop.server";
import { listActiveAlerts } from "../services/alerts.server";
import { getRecentSyncRuns } from "../services/sync.server";
import { formatCurrency, formatDateTime } from "../utils/formatting";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShopOverview(session.shop);
  const alerts = shop?.id ? await listActiveAlerts(shop.id) : [];
  const syncRuns = shop?.id ? await getRecentSyncRuns(shop.id, 3) : [];

  return {
    shopDomain: session.shop,
    connectionStatus: shop?.openAIConnection?.status || "DISCONNECTED",
    productCount: shop?._count.products || 0,
    alertsCount: alerts.length,
    activeRulesCount: shop?._count.spendRules || 0,
    syncRuns,
  };
};

export default function OverviewPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <s-page heading="Overview">
      <s-button slot="primary-action" href="/app/settings">
        Connect ChatGPT Ads
      </s-button>

      {/* Connection Notice */}
      {data.connectionStatus === "DISCONNECTED" && (
        <s-banner
          tone="info"
          heading="Welcome to Cartlight: ChatGPT Ads HQ"
        >
          <s-paragraph>
            Your Shopify store is initialized and ready. Connect your OpenAI Ads account in{" "}
            <s-link href="/app/settings">Settings</s-link> to enable ChatGPT product feed synchronization, campaign attribution, and AI-driven ad tracking.
          </s-paragraph>
        </s-banner>
      )}

      {/* KPI Highlights Grid */}
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
          title="Blended Ad Spend"
          value={formatCurrency(0)}
          subtitle="Last 30 days"
        />
        <MetricCard
          title="Conversion Value"
          value={formatCurrency(0)}
          subtitle="ChatGPT attributed"
        />
        <MetricCard
          title="Blended ROAS"
          value="0.00x"
          subtitle="Target: 3.50x"
        />
        <MetricCard
          title="Synced Products"
          value={String(data.productCount)}
          subtitle="Ready for AI matching"
        />
      </div>

      {/* Operational Modules */}
      <s-section heading="System Status & Feed Health">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e1e3e5",
              borderRadius: "6px",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#202223" }}>
                ChatGPT Ads Connection
              </div>
              <div style={{ fontSize: "12px", color: "#6d7175" }}>
                API integration for ad placements and organic merchant matching
              </div>
            </div>
            <StatusBadge status={data.connectionStatus} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e1e3e5",
              borderRadius: "6px",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#202223" }}>
                Active Guardrails & Rules
              </div>
              <div style={{ fontSize: "12px", color: "#6d7175" }}>
                Automated budget protection and margin threshold stops
              </div>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              {data.activeRulesCount} active
            </div>
          </div>
        </div>
      </s-section>

      {/* Quick Links / Aside */}
      <s-section slot="aside" heading="Quick Navigation">
        <s-unordered-list>
          <s-list-item>
            <s-link href="/app/profitability">Analyze Profitability</s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="/app/products">Manage Product Feed</s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="/app/tracking">Verify Conversion Tracking</s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="/app/campaigns">View ChatGPT Campaigns</s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="/app/alerts">Active Alerts ({data.alertsCount})</s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Recent Sync Activity">
        {data.syncRuns.length === 0 ? (
          <s-paragraph>No sync runs executed yet.</s-paragraph>
        ) : (
          <s-unordered-list>
            {data.syncRuns.map((run) => (
              <s-list-item key={run.id}>
                {run.syncType} ({run.status}) — {formatDateTime(run.startedAt)}
              </s-list-item>
            ))}
          </s-unordered-list>
        )}
      </s-section>
    </s-page>
  );
}
