import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { logger } from "../utils/logger.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  logger.info(`Received ${topic} webhook for ${shop}`);

  // Clean up sessions for the uninstalled shop
  if (session) {
    await db.session.deleteMany({ where: { shop } });
  }

  // Soft-deactivate local shop record
  try {
    await db.shop.updateMany({
      where: { shopifyDomain: shop },
      data: {
        isActive: false,
        uninstalledAt: new Date(),
      },
    });
  } catch (error) {
    logger.warn(`Could not mark shop as uninstalled: ${shop}`, { error });
  }

  return new Response();
};
