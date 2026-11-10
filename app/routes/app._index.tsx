/**
 * Cartlight: ChatGPT Ads HQ — Overview Dashboard
 * Cartlight Labs (c) 2026.
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";
import { EmptyStatePlaceholder } from "../components/EmptyStatePlaceholder";
import { syncShopFromAdmin, getShopOverview } from "../services/shop.server";
import { listActiveAlerts } from "../services/alerts.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const { shop, totalProducts } = await syncShopFromAdmin(admin, session.shop);
  const overview = await getShopOverview(session.shop);
  const alerts = shop?.id ? await listActiveAlerts(shop.id) : [];

  const productCount = totalProducts ?? overview?._count.products ?? 0;

  return {
    shopDomain: session.shop,
    shopName: shop?.name || session.shop.replace(".myshopify.com", ""),
    currency: shop?.currency || "USD",
    shopifyStatus: shop?.isActive ? "Active" : "Inactive",
    openAIStatus: "Not connected" as const,
    productCount,
    alertsCount: alerts.length,
    activeRulesCount: overview?._count.spendRules || 0,
  };
};

export default function OverviewPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <s-page heading="Overview">
      <s-button slot="primary-action" href="/app/settings">
        Connect ChatGPT Ads
      </s-button>

      {/* Welcome Banner */}
      <s-banner tone="info" heading={`Welcome to Cartlight, ${data.shopName}`}>
        <s-paragraph>
          Your Shopify store is authenticated and linked. Connect your OpenAI Ads account in{" "}
          <s-link href="/app/settings">Settings</s-link> to activate ChatGPT campaign tracking, automated product feed matching, and real-time margin guardrails.
        </s-paragraph>
      </s-banner>

      {/* Store & Integration Summary Cards */}
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
          title="Store Connection"
          value={data.shopifyStatus}
          subtitle={`Shopify: ${data.shopDomain}`}
        />
        <MetricCard
          title="Store Currency"
          value={data.currency}
          subtitle="Catalog billing currency"
        />
        <MetricCard
          title="Catalog Products"
          value={String(data.productCount)}
          subtitle="Detected in Shopify store"
        />
        <MetricCard
          title="ChatGPT Ads Integration"
          value={data.openAIStatus}
          subtitle="Phase 2 integration ready"
        />
      </div>

      {/* Store Information Details Card */}
      <s-section heading="Authenticated Store Details">
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e1e3e5",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", color: "#6d7175", marginBottom: "4px" }}>Store Name</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#202223" }}>{data.shopName}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6d7175", marginBottom: "4px" }}>Shopify Domain</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#202223" }}>{data.shopDomain}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6d7175", marginBottom: "4px" }}>Operating Currency</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#202223" }}>{data.currency}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6d7175", marginBottom: "4px" }}>Shopify Connection</div>
            <div>
              <StatusBadge status={data.shopifyStatus} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6d7175", marginBottom: "4px" }}>OpenAI Ads Status</div>
            <div>
              <StatusBadge status={data.openAIStatus} />
            </div>
          </div>
        </div>
      </s-section>

      {/* Pipeline Status Empty State */}
      <s-section heading="Advertising Intelligence & Attribution">
        <EmptyStatePlaceholder
          icon="⚡"
          title="ChatGPT Advertising Pipeline Not Connected"
          description="Product synchronization, conversion attribution, and margin guardrails will activate automatically in subsequent phases once OpenAI Ads API integration is configured."
          actionLabel="View Integration Settings"
          actionHref="/app/settings"
        />
      </s-section>

      {/* Quick Links / Aside */}
      <s-section slot="aside" heading="Application Modules">
        <s-unordered-list>
          <s-list-item>
            <s-link href="/app/profitability">Profitability</s-link> — Net margins & ROAS tracking
          </s-list-item>
          <s-list-item>
            <s-link href="/app/products">Products</s-link> — Catalog sync & COGS
          </s-list-item>
          <s-list-item>
            <s-link href="/app/tracking">Tracking</s-link> — Conversion attribution & pixel
          </s-list-item>
          <s-list-item>
            <s-link href="/app/campaigns">Campaigns</s-link> — Ad sets & creative performance
          </s-list-item>
          <s-list-item>
            <s-link href="/app/alerts">Alerts</s-link> — Margin notifications ({data.alertsCount})
          </s-list-item>
          <s-list-item>
            <s-link href="/app/settings">Settings</s-link> — API keys & spend rules ({data.activeRulesCount})
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}
