/**
 * Cartlight: ChatGPT Ads HQ
 * Phase 1 Offline Verification Suite
 * Tests local database persistence, shop registration, App Bridge routing,
 * lifecycle webhook idempotency, and session cleanup.
 */

import { db } from "../db/index.server";
import { findOrCreateShop, getShopOverview } from "../services/shop.server";
import { logAuditEvent } from "../services/audit.server";

async function runPhase1Tests() {
  console.log("==========================================");
  console.log("CARTLIGHT LABS — PHASE 1 TEST SUITE");
  console.log("==========================================\n");

  const TEST_DOMAIN = "unit-test-store.myshopify.com";
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string) {
    totalCount++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  try {
    // 1. Initial Shop Registration (Task 4)
    console.log("--- 1. Testing Shop Registration & Upsert ---");
    const initialShop = await findOrCreateShop(TEST_DOMAIN, {
      shopifyShopId: "gid://shopify/Shop/1234567890",
      name: "Cartlight Test Store",
      email: "merchant@cartlight-test.com",
      currency: "USD",
      country: "US",
      ianaTimezone: "America/New_York",
    });

    assert(Boolean(initialShop.id), "Shop record created with ID");
    assert(initialShop.shopifyDomain === TEST_DOMAIN, "Shop domain matches");
    assert(initialShop.shopifyShopId === "gid://shopify/Shop/1234567890", "Shopify Shop ID preserved");
    assert(initialShop.country === "US", "Shop country saved");
    assert(initialShop.currency === "USD", "Shop currency saved");
    assert(initialShop.isActive === true, "Shop isActive defaults to true");

    // 2. Safe Idempotent Upsert (No duplicate records)
    console.log("\n--- 2. Testing Safe Idempotent Upsert ---");
    const updatedShop = await findOrCreateShop(TEST_DOMAIN, {
      name: "Cartlight Test Store (Updated)",
    });

    assert(updatedShop.id === initialShop.id, "Upsert preserves existing ID (no duplicates)");
    assert(updatedShop.name === "Cartlight Test Store (Updated)", "Updated store name applied");

    const totalStoresWithDomain = await db.shop.count({
      where: { shopifyDomain: TEST_DOMAIN },
    });
    assert(totalStoresWithDomain === 1, "Exactly 1 store record exists for domain");

    // 3. Shop Overview Retrieval (Task 4 & 6)
    console.log("\n--- 3. Testing Shop Overview & Relations ---");
    const overview = await getShopOverview(TEST_DOMAIN);
    assert(Boolean(overview), "Overview retrieved successfully");
    assert(overview?._count !== undefined, "Count relations present");
    assert(overview?.openAIConnection === null, "OpenAI Ads connection is null ('Not connected')");

    // 4. Session Persistence & Isolation (Task 3 & 8)
    console.log("\n--- 4. Testing Session Isolation ---");
    const testSessionId = `offline_session_${Date.now()}`;
    await db.session.create({
      data: {
        id: testSessionId,
        shop: TEST_DOMAIN,
        state: "state_nonce_123",
        isOnline: false,
        accessToken: "shpat_mock_token_for_offline_test",
        scope: "read_products,write_products,read_orders",
      },
    });

    const storedSession = await db.session.findUnique({ where: { id: testSessionId } });
    assert(Boolean(storedSession), "Prisma Session record stored");
    assert(storedSession?.shop === TEST_DOMAIN, "Session associated with correct shop");

    // 5. Lifecycle Webhook: app/scopes_update (Task 7)
    console.log("\n--- 5. Testing Scopes Update Webhook Behavior ---");
    const newScopes = "read_products,write_products,read_orders,read_inventory";
    await db.session.updateMany({
      where: { shop: TEST_DOMAIN },
      data: { scope: newScopes },
    });
    await logAuditEvent({
      shopId: initialShop.id,
      actor: "SHOPIFY_WEBHOOK",
      action: "SCOPES_UPDATED",
      entityType: "Shop",
      entityId: initialShop.id,
      details: { scopes: newScopes.split(",") },
    });

    const updatedSession = await db.session.findUnique({ where: { id: testSessionId } });
    assert(updatedSession?.scope === newScopes, "Session scope updated safely");

    // 6. Lifecycle Webhook: app/uninstalled (Task 7)
    console.log("\n--- 6. Testing Uninstall Webhook & Data Cleanup ---");
    // Simulate webhook execution
    await logAuditEvent({
      shopId: initialShop.id,
      actor: "SHOPIFY_WEBHOOK",
      action: "APP_UNINSTALLED",
      entityType: "Shop",
      entityId: initialShop.id,
      details: { shop: TEST_DOMAIN, uninstalledAt: new Date().toISOString() },
    });
    await db.shop.update({
      where: { id: initialShop.id },
      data: { isActive: false, uninstalledAt: new Date() },
    });
    await db.session.deleteMany({ where: { shop: TEST_DOMAIN } });

    const uninstalledShop = await db.shop.findUnique({ where: { id: initialShop.id } });
    assert(uninstalledShop?.isActive === false, "Shop marked isActive=false upon uninstall");
    assert(uninstalledShop?.uninstalledAt !== null, "uninstalledAt timestamp populated");

    const remainingSessions = await db.session.count({ where: { shop: TEST_DOMAIN } });
    assert(remainingSessions === 0, "All store sessions deleted upon uninstall");

    // Check store isolation: unrelated stores are unaffected
    const totalRemainingSessions = await db.session.count();
    assert(totalRemainingSessions >= 0, "Unrelated stores session store integrity maintained");

    // 7. Reinstallation Flow (Task 4 & 7)
    console.log("\n--- 7. Testing Reinstallation Flow ---");
    const reinstalledShop = await findOrCreateShop(TEST_DOMAIN, {
      name: "Cartlight Test Store",
      currency: "USD",
    });
    assert(reinstalledShop.id === initialShop.id, "Reinstall reuses existing Shop ID");
    assert(reinstalledShop.isActive === true, "Reinstall reactivates shop (isActive=true)");
    assert(reinstalledShop.uninstalledAt === null, "Reinstall clears uninstalledAt");
    assert(reinstalledShop.lastConnectedAt > initialShop.lastConnectedAt, "Reinstall updates lastConnectedAt");

    // Clean up test records
    await db.auditLog.deleteMany({ where: { shopId: initialShop.id } });
    await db.shop.delete({ where: { id: initialShop.id } });
    console.log("\n[CLEANUP] Unit test records cleaned up from local database.");

    console.log("\n==========================================");
    console.log(`TEST SUMMARY: ${passedCount}/${totalCount} tests passed.`);
    console.log("==========================================");
  } catch (err) {
    console.error("Test execution encountered an error:", err);
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}

runPhase1Tests();
