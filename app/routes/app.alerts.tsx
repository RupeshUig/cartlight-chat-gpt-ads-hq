/**
 * Cartlight: ChatGPT Ads HQ — Alerts Page
 * Cartlight Labs (c) 2026.
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { MetricCard } from "../components/MetricCard";
import { EmptyStatePlaceholder } from "../components/EmptyStatePlaceholder";
import { db } from "../db/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await db.shop.findUnique({
    where: { shopifyDomain: session.shop },
    include: {
      alerts: {
        where: { isDismissed: false },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  return {
    alerts: shop?.alerts || [],
    unreadCount: shop?.alerts.filter((a) => !a.isRead).length || 0,
    criticalCount: shop?.alerts.filter((a) => a.severity === "CRITICAL").length || 0,
  };
};

export default function AlertsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <s-page heading="Alerts">
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
          title="Active Alerts"
          value={String(data.alerts.length)}
          subtitle="Pending review"
        />
        <MetricCard
          title="Unread"
          value={String(data.unreadCount)}
          subtitle="Awaiting acknowledgment"
        />
        <MetricCard
          title="Critical Anomalies"
          value={String(data.criticalCount)}
          subtitle="Budget or margin blocks"
        />
        <MetricCard
          title="Alert Channels"
          value="In-App + Email"
          subtitle="Notification routes"
        />
      </div>

      <s-section heading="Operational Notifications & Guardrail Triggers">
        {data.alerts.length === 0 ? (
          <EmptyStatePlaceholder
            icon="🔔"
            title="All Guardrails Operational & Healthy"
            description="No budget anomalies, feed sync failures, or margin threshold violations have been triggered."
            actionLabel="Review Alert Rules"
            actionHref="/app/settings"
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: "16px",
                  border: "1px solid #e1e3e5",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#202223" }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "4px" }}>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </s-section>

      <s-section slot="aside" heading="Alert Categories">
        <s-paragraph>
          <strong>Budget Anomalies:</strong> Triggers when daily spend surges beyond statistical norms.
        </s-paragraph>
        <s-paragraph>
          <strong>Margin Thresholds:</strong> Triggers when product returns or discounted checkout margins fall below target limits.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
