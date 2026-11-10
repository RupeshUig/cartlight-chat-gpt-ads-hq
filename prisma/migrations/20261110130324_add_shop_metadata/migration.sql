-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyDomain" TEXT NOT NULL,
    "shopifyShopId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "country" TEXT,
    "ianaTimezone" TEXT NOT NULL DEFAULT 'UTC',
    "installedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" DATETIME,
    "lastConnectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Shop" ("createdAt", "currency", "email", "ianaTimezone", "id", "installedAt", "isActive", "name", "shopifyDomain", "uninstalledAt", "updatedAt") SELECT "createdAt", "currency", "email", "ianaTimezone", "id", "installedAt", "isActive", "name", "shopifyDomain", "uninstalledAt", "updatedAt" FROM "Shop";
DROP TABLE "Shop";
ALTER TABLE "new_Shop" RENAME TO "Shop";
CREATE UNIQUE INDEX "Shop_shopifyDomain_key" ON "Shop"("shopifyDomain");
CREATE INDEX "Shop_shopifyDomain_idx" ON "Shop"("shopifyDomain");
CREATE INDEX "Shop_shopifyShopId_idx" ON "Shop"("shopifyShopId");
CREATE INDEX "Shop_isActive_idx" ON "Shop"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
