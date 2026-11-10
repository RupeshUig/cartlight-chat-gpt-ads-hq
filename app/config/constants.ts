/**
 * Cartlight: ChatGPT Ads HQ
 * Application Constants & Branding
 * Cartlight Labs (c) 2026.
 */

export const BRAND_NAME = "Cartlight";
export const APP_NAME = "Cartlight: ChatGPT Ads HQ";
export const COMPANY_NAME = "Cartlight Labs";
export const APP_VERSION = "0.1.0-alpha";

export const NAVIGATION_ITEMS = [
  { label: "Overview", href: "/app" },
  { label: "Profitability", href: "/app/profitability" },
  { label: "Products", href: "/app/products" },
  { label: "Tracking", href: "/app/tracking" },
  { label: "Campaigns", href: "/app/campaigns" },
  { label: "Alerts", href: "/app/alerts" },
  { label: "Settings", href: "/app/settings" },
] as const;

export const SYNC_STATUSES = {
  PENDING: "PENDING",
  SYNCED: "SYNCED",
  FAILED: "FAILED",
  EXCLUDED: "EXCLUDED",
} as const;

export const ALERT_SEVERITIES = {
  INFO: "INFO",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
} as const;

export const CONNECTION_STATUSES = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  PENDING: "PENDING",
  ERROR: "ERROR",
} as const;
