/**
 * Cartlight: ChatGPT Ads HQ
 * Environment Variable Validation & Configuration
 * Cartlight Labs (c) 2026.
 */

export interface AppEnvConfig {
  NODE_ENV: "development" | "production" | "test";
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  SHOPIFY_APP_URL: string;
  SCOPES: string[];
  DATABASE_URL: string;
  PORT: number;
  OPENAI_API_KEY?: string;
  OPENAI_ORGANIZATION_ID?: string;
  OPENAI_ADS_ACCOUNT_ID?: string;
}

/**
 * Validates and sanitizes environment configuration at runtime.
 * Never leaks raw secrets to logs or client bundles.
 */
export function validateEnv(): AppEnvConfig {
  const nodeEnv = (process.env.NODE_ENV || "development") as AppEnvConfig["NODE_ENV"];
  const databaseUrl = process.env.DATABASE_URL || "file:./dev.sqlite";
  const apiKey = process.env.SHOPIFY_API_KEY || "";
  const apiSecret = process.env.SHOPIFY_API_SECRET || "";
  const appUrl = process.env.SHOPIFY_APP_URL || "https://localhost:3000";
  const scopes = (process.env.SCOPES || "write_products,read_products,read_orders")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const port = parseInt(process.env.PORT || "3000", 10);

  if (nodeEnv === "production") {
    const missing: string[] = [];
    if (!apiKey) missing.push("SHOPIFY_API_KEY");
    if (!apiSecret) missing.push("SHOPIFY_API_SECRET");
    if (!appUrl) missing.push("SHOPIFY_APP_URL");

    if (missing.length > 0) {
      throw new Error(
        `[Cartlight Config Error] Missing mandatory production environment variables: ${missing.join(", ")}`
      );
    }
  }

  return {
    NODE_ENV: nodeEnv,
    SHOPIFY_API_KEY: apiKey,
    SHOPIFY_API_SECRET: apiSecret,
    SHOPIFY_APP_URL: appUrl,
    SCOPES: scopes,
    DATABASE_URL: databaseUrl,
    PORT: isNaN(port) ? 3000 : port,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ORGANIZATION_ID: process.env.OPENAI_ORGANIZATION_ID,
    OPENAI_ADS_ACCOUNT_ID: process.env.OPENAI_ADS_ACCOUNT_ID,
  };
}

export const envConfig = validateEnv();
