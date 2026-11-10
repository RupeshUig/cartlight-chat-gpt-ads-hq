/**
 * Cartlight: ChatGPT Ads HQ
 * Reusable Status Badge Component
 * Cartlight Labs (c) 2026.
 */

import React from "react";

export type StatusTone = "success" | "warning" | "critical" | "info" | "neutral";

interface StatusBadgeProps {
  status: string;
  tone?: StatusTone;
}

export function StatusBadge({ status, tone }: StatusBadgeProps): React.ReactElement {
  let computedTone: StatusTone = tone || "neutral";

  if (!tone) {
    const s = status.toUpperCase();
    if (["CONNECTED", "SYNCED", "SUCCESS", "ACTIVE"].includes(s)) {
      computedTone = "success";
    } else if (["PENDING", "RUNNING", "WARNING"].includes(s)) {
      computedTone = "warning";
    } else if (["FAILED", "ERROR", "CRITICAL", "DISCONNECTED"].includes(s)) {
      computedTone = "critical";
    } else if (["INFO", "PARTIAL"].includes(s)) {
      computedTone = "info";
    }
  }

  const toneStyles: Record<StatusTone, { bg: string; color: string; border: string }> = {
    success: { bg: "#e4f7eb", color: "#107c41", border: "#a3e4be" },
    warning: { bg: "#fff7db", color: "#8a6100", border: "#fadc7d" },
    critical: { bg: "#fde8e8", color: "#c5221f", border: "#f8b4b4" },
    info: { bg: "#e8f0fe", color: "#1967d2", border: "#aecbfa" },
    neutral: { bg: "#f1f2f4", color: "#474d57", border: "#d0d4dc" },
  };

  const style = toneStyles[computedTone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}
