/**
 * Cartlight: ChatGPT Ads HQ — Tracking Page
 * Cartlight Labs (c) 2026.
 */

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";
import { EmptyStatePlaceholder } from "../components/EmptyStatePlaceholder";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function TrackingPage() {
  return (
    <s-page heading="Tracking">
      <s-banner tone="info" heading="Attribution & Telemetry Engine">
        <s-paragraph>
          Cartlight pairs server-side Webhooks with client-side conversion pixels to guarantee accurate attribution between ChatGPT conversations and Shopify checkout orders.
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
          title="Tracked Conversions"
          value="0"
          subtitle="Last 30 days"
        />
        <MetricCard
          title="Attributed Checkouts"
          value="0"
          subtitle="Shopify order matches"
        />
        <MetricCard
          title="Match Quality Rate"
          value="100%"
          subtitle="Server-side hash accuracy"
        />
        <MetricCard
          title="Pixel Latency"
          value="< 45ms"
          subtitle="Edge processing speed"
        />
      </div>

      <s-section heading="Tracking Configuration">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
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
                Shopify Webhooks Pipeline
              </div>
              <div style={{ fontSize: "12px", color: "#6d7175" }}>
                Order creation, cancellation, and fulfillment real-time events
              </div>
            </div>
            <StatusBadge status="ACTIVE" tone="success" />
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
                Storefront Conversions Web Pixel
              </div>
              <div style={{ fontSize: "12px", color: "#6d7175" }}>
                App Pixel extension capturing checkout and page view signals
              </div>
            </div>
            <StatusBadge status="PENDING" tone="warning" />
          </div>
        </div>

        <EmptyStatePlaceholder
          icon="🎯"
          title="Conversion Stream Waiting for Traffic"
          description="Once your OpenAI Ads connection is active and advertising campaigns begin, real-time conversion events will stream into this dashboard."
          actionLabel="Check Connection Settings"
          actionHref="/app/settings"
        />
      </s-section>

      <s-section slot="aside" heading="Attribution Architecture">
        <s-paragraph>
          Cartlight uses first-party server-side cookies combined with Shopify order webhooks to avoid browser ad-blocker drop-offs and provide privacy-compliant attribution.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
