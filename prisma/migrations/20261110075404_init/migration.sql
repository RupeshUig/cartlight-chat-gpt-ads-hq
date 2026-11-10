-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyDomain" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "ianaTimezone" TEXT NOT NULL DEFAULT 'UTC',
    "installedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "shopifyProductId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "handle" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "vendor" TEXT,
    "productType" TEXT,
    "totalInventory" INTEGER NOT NULL DEFAULT 0,
    "isSyncedToChatGPT" BOOLEAN NOT NULL DEFAULT false,
    "chatGPTSyncStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "shopifyVariantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sku" TEXT,
    "price" REAL NOT NULL DEFAULT 0.0,
    "compareAtPrice" REAL,
    "inventoryQuantity" INTEGER NOT NULL DEFAULT 0,
    "barcode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OpenAIConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "organizationId" TEXT,
    "accountId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "lastConnectedAt" DATETIME,
    "lastSyncAt" DATETIME,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OpenAIConnection_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SyncRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "itemsTotal" INTEGER NOT NULL DEFAULT 0,
    "itemsProcessed" INTEGER NOT NULL DEFAULT 0,
    "itemsFailed" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SyncRun_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyInsight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
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

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "dismissedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Alert_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpendRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ruleType" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "lastTriggeredAt" DATETIME,
    "triggerCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SpendRule_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopifyDomain_key" ON "Shop"("shopifyDomain");

-- CreateIndex
CREATE INDEX "Shop_shopifyDomain_idx" ON "Shop"("shopifyDomain");

-- CreateIndex
CREATE INDEX "Shop_isActive_idx" ON "Shop"("isActive");

-- CreateIndex
CREATE INDEX "Product_shopId_idx" ON "Product"("shopId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_chatGPTSyncStatus_idx" ON "Product"("chatGPTSyncStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopId_shopifyProductId_key" ON "Product"("shopId", "shopifyProductId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_shopifyVariantId_key" ON "ProductVariant"("productId", "shopifyVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenAIConnection_shopId_key" ON "OpenAIConnection"("shopId");

-- CreateIndex
CREATE INDEX "OpenAIConnection_shopId_idx" ON "OpenAIConnection"("shopId");

-- CreateIndex
CREATE INDEX "OpenAIConnection_status_idx" ON "OpenAIConnection"("status");

-- CreateIndex
CREATE INDEX "SyncRun_shopId_idx" ON "SyncRun"("shopId");

-- CreateIndex
CREATE INDEX "SyncRun_status_idx" ON "SyncRun"("status");

-- CreateIndex
CREATE INDEX "SyncRun_startedAt_idx" ON "SyncRun"("startedAt");

-- CreateIndex
CREATE INDEX "DailyInsight_shopId_idx" ON "DailyInsight"("shopId");

-- CreateIndex
CREATE INDEX "DailyInsight_date_idx" ON "DailyInsight"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyInsight_shopId_date_key" ON "DailyInsight"("shopId", "date");

-- CreateIndex
CREATE INDEX "Alert_shopId_idx" ON "Alert"("shopId");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE INDEX "SpendRule_shopId_idx" ON "SpendRule"("shopId");

-- CreateIndex
CREATE INDEX "SpendRule_isActive_idx" ON "SpendRule"("isActive");

-- CreateIndex
CREATE INDEX "AuditLog_shopId_idx" ON "AuditLog"("shopId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Session_shop_idx" ON "Session"("shop");
