-- AlterTable
ALTER TABLE "OpenAIConnection" ADD COLUMN "encryptedApiKey" TEXT;
ALTER TABLE "OpenAIConnection" ADD COLUMN "keyPreview" TEXT;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN "cost" REAL;
ALTER TABLE "ProductVariant" ADD COLUMN "shopifyInventoryItemId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyInsight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "granularity" TEXT NOT NULL DEFAULT 'SHOP',
    "entityId" TEXT NOT NULL DEFAULT 'SHOP',
    "campaignId" TEXT,
    "campaignName" TEXT,
    "adGroupId" TEXT,
    "adGroupName" TEXT,
    "adId" TEXT,
    "adName" TEXT,
    "productId" TEXT,
    "variantId" TEXT,
    "adSpend" REAL NOT NULL DEFAULT 0.0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "conversionValue" REAL NOT NULL DEFAULT 0.0,
    "roas" REAL NOT NULL DEFAULT 0.0,
    "cpa" REAL NOT NULL DEFAULT 0.0,
    "grossProfit" REAL NOT NULL DEFAULT 0.0,
    "netProfit" REAL NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyInsight_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DailyInsight" ("adSpend", "clicks", "conversionValue", "conversions", "cpa", "createdAt", "currency", "date", "grossProfit", "id", "impressions", "netProfit", "roas", "shopId", "updatedAt") SELECT "adSpend", "clicks", "conversionValue", "conversions", "cpa", "createdAt", "currency", "date", "grossProfit", "id", "impressions", "netProfit", "roas", "shopId", "updatedAt" FROM "DailyInsight";
DROP TABLE "DailyInsight";
ALTER TABLE "new_DailyInsight" RENAME TO "DailyInsight";
CREATE INDEX "DailyInsight_shopId_granularity_idx" ON "DailyInsight"("shopId", "granularity");
CREATE INDEX "DailyInsight_campaignId_idx" ON "DailyInsight"("campaignId");
CREATE INDEX "DailyInsight_productId_idx" ON "DailyInsight"("productId");
CREATE INDEX "DailyInsight_date_idx" ON "DailyInsight"("date");
CREATE UNIQUE INDEX "DailyInsight_shopId_date_granularity_entityId_key" ON "DailyInsight"("shopId", "date", "granularity", "entityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProductVariant_shopifyInventoryItemId_idx" ON "ProductVariant"("shopifyInventoryItemId");
