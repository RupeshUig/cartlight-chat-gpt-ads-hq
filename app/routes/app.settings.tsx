/**
 * Cartlight: ChatGPT Ads HQ — Settings Page
 * Cartlight Labs (c) 2026.
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { StatusBadge } from "../components/StatusBadge";
import { db } from "../db/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await db.shop.findUnique({
    where: { shopifyDomain: session.shop },
    include: {
      openAIConnection: true,
      spendRules: true,
    },
  });

  return {
    shopDomain: session.shop,
    currency: shop?.currency || "USD",
    timezone: shop?.ianaTimezone || "UTC",
    connectionStatus: shop?.openAIConnection?.status === "CONNECTED" ? "CONNECTED" : "Not connected",
    organizationId: shop?.openAIConnection?.organizationId || "",
    rulesCount: shop?.spendRules.length || 0,
  };
};

export default function SettingsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <s-page heading="Settings">
      {/* OpenAI Ads Connection Card */}
      <s-section heading="OpenAI Ads Integration">
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e1e3e5",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px", color: "#202223" }}>
                ChatGPT Ads Account Connection
              </div>
              <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>
                Connect your OpenAI organization and Ads management credentials.
              </div>
            </div>
            <StatusBadge status={data.connectionStatus} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              border: "1px solid #eef0f2",
            }}
          >
            <div>
              <label
                htmlFor="organizationId"
                style={{ fontSize: "12px", fontWeight: 600, color: "#474d57", display: "block", marginBottom: "4px" }}
              >
                OpenAI Organization ID
              </label>
              <input
                id="organizationId"
                name="organizationId"
                type="text"
                readOnly
                placeholder="org-xxxxxxxxxxxxxxxx"
                value={data.organizationId}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #c9cccf",
                  backgroundColor: "#ffffff",
                  fontSize: "13px",
                  color: "#202223",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="accountId"
                style={{ fontSize: "12px", fontWeight: 600, color: "#474d57", display: "block", marginBottom: "4px" }}
              >
                Ads Account ID
              </label>
              <input
                id="accountId"
                name="accountId"
                type="text"
                readOnly
                placeholder="act-xxxxxxxxxxxxxxxx"
                value=""
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #c9cccf",
                  backgroundColor: "#ffffff",
                  fontSize: "13px",
                  color: "#202223",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <s-button variant="primary">
              Connect Account (Phase 1)
            </s-button>
          </div>
        </div>
      </s-section>

      {/* Spend Guardrails */}
      <s-section heading="Automated Spend Guardrails">
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e1e3e5",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: "15px", color: "#202223" }}>
            Safety Rules & Margin Limits
          </div>
          <p style={{ fontSize: "13px", color: "#6d7175", margin: 0 }}>
            Configure maximum daily ad spend limits and automatic pause rules when target ROAS or minimum product margins are breached.
          </p>

          <div style={{ marginTop: "8px", fontSize: "13px", color: "#202223" }}>
            Active Rules: <strong>{data.rulesCount} configured</strong>
          </div>
        </div>
      </s-section>

      {/* Store Configuration Aside */}
      <s-section slot="aside" heading="Store Preferences">
        <s-paragraph>
          <strong>Shopify Domain:</strong> {data.shopDomain}
        </s-paragraph>
        <s-paragraph>
          <strong>Currency:</strong> {data.currency}
        </s-paragraph>
        <s-paragraph>
          <strong>Timezone:</strong> {data.timezone}
        </s-paragraph>
      </s-section>

      <s-section slot="aside" heading="Security & Privacy">
        <s-paragraph>
          API tokens are encrypted at rest and never shared with third-party tracking networks. All sync operations comply with Shopify Partner API policies.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
