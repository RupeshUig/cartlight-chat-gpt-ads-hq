import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";

import { authenticate } from "../shopify.server";
import { AppHeader } from "../components/AppHeader";
import { findOrCreateShop } from "../services/shop.server";
import { logger } from "../utils/logger.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  try {
    await findOrCreateShop(session.shop);
  } catch (error) {
    logger.warn("Could not sync shop record on app load", { shop: session.shop });
  }

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shopDomain: session.shop,
  };
};

export default function App() {
  const { apiKey, shopDomain } = useLoaderData<typeof loader>();

  return (
    <AppProvider apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Overview</s-link>
        <s-link href="/app/profitability">Profitability</s-link>
        <s-link href="/app/products">Products</s-link>
        <s-link href="/app/tracking">Tracking</s-link>
        <s-link href="/app/campaigns">Campaigns</s-link>
        <s-link href="/app/alerts">Alerts</s-link>
        <s-link href="/app/settings">Settings</s-link>
      </s-app-nav>
      <AppHeader connectionStatus="DISCONNECTED" storeDomain={shopDomain} />
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses so headers are included
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
