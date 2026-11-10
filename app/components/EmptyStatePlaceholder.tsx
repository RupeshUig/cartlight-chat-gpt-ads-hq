/**
 * Cartlight: ChatGPT Ads HQ
 * Reusable Modern Empty State Component
 * Cartlight Labs (c) 2026.
 */

import React from "react";

interface EmptyStatePlaceholderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: string;
}

export function EmptyStatePlaceholder({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  icon = "⚡",
}: EmptyStatePlaceholderProps): React.ReactElement {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px dashed #c9cccf",
        borderRadius: "8px",
        padding: "48px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "16px 0",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#f6f6f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#202223",
          margin: "0 0 8px 0",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: "#6d7175",
          maxWidth: "460px",
          margin: "0 0 20px 0",
          lineHeight: "1.5",
        }}
      >
        {description}
      </p>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          style={{
            display: "inline-block",
            padding: "8px 16px",
            backgroundColor: "#000000",
            color: "#ffffff",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {actionLabel}
        </a>
      )}
      {actionLabel && !actionHref && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: "8px 16px",
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
