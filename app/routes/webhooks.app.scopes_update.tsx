import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";
import { logAuditEvent } from "../services/audit.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);
  logger.info(`Received ${topic} webhook for ${shop}`, { shop, topic });

  try {
    const current = (payload.current as string[]) || [];
    const scopeString = current.join(",");

    await db.session.updateMany({
      where: { shop },
      data: {
        scope: scopeString,
      },
    });

    const existingShop = await db.shop.findUnique({ where: { shopifyDomain: shop } });
    if (existingShop) {
      await logAuditEvent({
        shopId: existingShop.id,
        actor: "SHOPIFY_WEBHOOK",
        action: "SCOPES_UPDATED",
        entityType: "Shop",
        entityId: existingShop.id,
        details: { scopes: current },
      });
    }
  } catch (error) {
    logger.warn(`Error updating scopes for shop: ${shop}`, { error });
  }

  return new Response();
};
