/**
 * Cartlight: ChatGPT Ads HQ
 * Global Application Brand Header
 * Cartlight Labs (c) 2026.
 */

import React from "react";
import { APP_NAME, COMPANY_NAME } from "../config/constants";
import { StatusBadge } from "./StatusBadge";

interface AppHeaderProps {
  connectionStatus?: string;
  storeDomain?: string;
}

export function AppHeader({
  connectionStatus = "DISCONNECTED",
  storeDomain,
}: AppHeaderProps): React.ReactElement {
  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e1e3e5",
        padding: "12px 20px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            backgroundColor: "#000000",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "16px",
            letterSpacing: "-0.5px",
          }}
        >
          C
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#202223" }}>
              {APP_NAME}
            </span>
            <span
              style={{
                fontSize: "11px",
                padding: "1px 6px",
                borderRadius: "3px",
                backgroundColor: "#f4f6f8",
                color: "#6d7175",
                fontWeight: 500,
              }}
            >
              by {COMPANY_NAME}
            </span>
          </div>
          {storeDomain && (
            <div style={{ fontSize: "12px", color: "#6d7175" }}>
              Connected store: <strong>{storeDomain}</strong>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "12px", color: "#6d7175" }}>ChatGPT Ads Status:</span>
        <StatusBadge status={connectionStatus} />
      </div>
    </header>
  );
}
