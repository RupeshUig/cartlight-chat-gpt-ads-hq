import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import { APP_NAME, COMPANY_NAME } from "../../config/constants";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{APP_NAME}</h1>
        <p className={styles.text}>
          by {COMPANY_NAME} — Intelligent advertising intelligence, ChatGPT feed management, and margin guardrails for Shopify merchants.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input
                className={styles.input}
                type="text"
                name="shop"
                placeholder="my-shop-domain.myshopify.com"
                required
              />
              <span>Enter your store myshopify.com domain to log in</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>ChatGPT Ad Attribution</strong>. Connect conversational AI ad placements directly to Shopify checkouts and repeat customers.
          </li>
          <li>
            <strong>Unit Economics & Net Profit</strong>. Calculate true contribution margin after ad spend, merchant fees, and COGS.
          </li>
          <li>
            <strong>Automated Guardrails</strong>. Protect your ad budget with real-time margin alerts before ROAS drops below breakeven.
          </li>
        </ul>
      </div>
    </div>
  );
}
