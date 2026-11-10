import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { db } from "../db/index.server";
import { logger } from "../utils/logger.server";
import { logAuditEvent } from "../services/audit.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  logger.info(`Received ${topic} webhook for ${shop}`);

  try {
    const existingShop = await db.shop.findUnique({ where: { shopifyDomain: shop } });
    if (existingShop) {
      await logAuditEvent({
        shopId: existingShop.id,
        actor: "SHOPIFY_WEBHOOK",
        action: "APP_UNINSTALLED",
        entityType: "Shop",
        entityId: existingShop.id,
        details: { shop, uninstalledAt: new Date().toISOString() },
      });

      await db.shop.update({
        where: { id: existingShop.id },
        data: {
          isActive: false,
          uninstalledAt: new Date(),
        },
      });
    }

    // Always clean up all sessions for the uninstalled shop
    await db.session.deleteMany({ where: { shop } });
  } catch (error) {
    logger.warn(`Error processing uninstallation webhook for: ${shop}`, { error });
  }

  return new Response();
};
