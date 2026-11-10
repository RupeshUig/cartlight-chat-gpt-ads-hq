/**
 * Cartlight: ChatGPT Ads HQ
 * Reusable Metric KPI Card Component
 * Cartlight Labs (c) 2026.
 */

import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeTone?: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeTone = "neutral",
  subtitle,
}: MetricCardProps): React.ReactElement {
  const changeColors = {
    positive: "#107c41",
    negative: "#c5221f",
    neutral: "#616a75",
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e1e3e5",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        flex: "1 1 200px",
      }}
    >
      <div style={{ fontSize: "13px", color: "#616a75", fontWeight: 500 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#202223",
          lineHeight: "1.2",
        }}
      >
        {value}
      </div>
      {(change || subtitle) && (
        <div style={{ fontSize: "12px", color: "#616a75", display: "flex", alignItems: "center", gap: "6px" }}>
          {change && (
            <span style={{ color: changeColors[changeTone], fontWeight: 600 }}>
              {change}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
