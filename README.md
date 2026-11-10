# Cartlight: ChatGPT Ads HQ

> **A production-quality Shopify embedded application built by Cartlight Labs.**

Cartlight connects Shopify merchant storefronts directly to OpenAI's advertising and conversational commerce ecosystem, providing real-time profitability analytics, automated feed synchronization, and margin guardrails.

---

## 🛠️ Technology Stack & Architecture

- **Framework:** Shopify Official React Router App Template (React Router v7)
- **Language:** TypeScript 5.9+ (strict mode enabled)
- **UI Platform:** Shopify App Bridge v4 with Shopify Polaris Web Components
- **Database / ORM:** Prisma ORM 6.19+ with SQLite (`file:dev.sqlite`) for local development (architected for PostgreSQL production migration)
- **Runtime:** Node.js (>=22.12 LTS supported)
- **Build System:** Vite 7.3+

---

## 📁 Project Structure

```text
CartLight/
├── app/
│   ├── config/                     # Configuration and environment validation
│   │   ├── constants.ts            # Branding, navigation, and system constants
│   │   └── env.server.ts           # Runtime typed environment variable validation
│   ├── db/                         # Database connection layer
│   │   └── index.server.ts         # Prisma client singleton & connection lifecycle
│   ├── utils/                      # Shared utility modules
│   │   ├── formatting.ts           # Currency, number, percentage, and date formatters
│   │   ├── logger.server.ts        # Structured logging utility with context
│   │   └── response.server.ts      # Typed API and JSON response builders
│   ├── components/                 # Reusable UI components
│   │   ├── AppHeader.tsx           # Global Cartlight brand banner with status badge
│   │   ├── MetricCard.tsx          # Standard SaaS KPI metric card
│   │   ├── StatusBadge.tsx         # Unified connection, sync, and alert status badge
│   │   └── EmptyStatePlaceholder.tsx # Standardized empty state card
│   ├── services/                   # Business domain services (scaffolded)
│   │   ├── shop.server.ts          # Shop lifecycle and metadata management
│   │   ├── alerts.server.ts        # Operational notifications & anomaly triggers
│   │   ├── sync.server.ts          # Product feed & telemetry sync runs
│   │   ├── spend-rules.server.ts   # Automated budget & margin guardrails
│   │   ├── audit.server.ts         # Security & compliance audit log service
│   │   └── shopify/                # Shopify Admin API integrations
│   │       ├── graphql.server.ts   # Typed GraphQL query execution helper
│   │       └── products.server.ts  # Catalog and variant query service
│   ├── routes/                     # Application routes (flat-route hierarchy)
│   │   ├── app.tsx                 # Root embedded app shell with navigation
│   │   ├── app._index.tsx          # Overview dashboard (KPI summary & system health)
│   │   ├── app.profitability.tsx   # Net/gross profit & blended ROAS analytics
│   │   ├── app.products.tsx        # ChatGPT catalog feed & variant sync status
│   │   ├── app.tracking.tsx        # Conversion attribution & web pixel telemetry
│   │   ├── app.campaigns.tsx       # ChatGPT conversational ad campaigns
│   │   ├── app.alerts.tsx          # Operational alerts & guardrail triggers
│   │   ├── app.settings.tsx        # OpenAI credentials & store preferences
│   │   ├── auth.$.tsx              # Shopify OAuth handling
│   │   └── webhooks.*.tsx          # Shopify Admin lifecycle webhooks
│   ├── db.server.ts                # Forwarding export for template compatibility
│   ├── shopify.server.ts           # Shopify App React Router configuration
│   └── root.tsx                    # HTML document root with Polaris font injection
├── prisma/
│   ├── schema.prisma               # Prisma schema (SQLite dev / PostgreSQL prod ready)
│   └── migrations/                 # Initial migration history
├── .env.example                    # Environment variable documentation template
├── shopify.app.toml                # Shopify CLI application manifest
└── package.json                    # Project metadata and build scripts
```

---

## 🗄️ Database Schema Summary

The database is managed with Prisma ORM. Models include:

| Model | Purpose | Key Relations & Indexes |
|---|---|---|
| **`Session`** | Shopify OAuth session storage | Indexed on `shop` |
| **`Shop`** | Installed merchant store profile | Indexed on `shopifyDomain`, `isActive` |
| **`Product`** | Shopify catalog feed item | Unique on `[shopId, shopifyProductId]`, indexed on `status`, `chatGPTSyncStatus` |
| **`ProductVariant`** | Variant pricing & inventory | Unique on `[productId, shopifyVariantId]`, indexed on `sku` |
| **`OpenAIConnection`**| OpenAI Ads API status & metadata | Unique on `shopId`, indexed on `status` |
| **`SyncRun`** | Catalog & telemetry batch sync history | Indexed on `shopId`, `status`, `startedAt` |
| **`DailyInsight`** | Daily spend, ROAS, and net profit | Unique on `[shopId, date]`, indexed on `date` |
| **`Alert`** | Budget anomaly & sync notifications | Indexed on `shopId`, `severity`, `isRead` |
| **`SpendRule`** | Automated guardrail configurations | Indexed on `shopId`, `isActive` |
| **`AuditLog`** | Security and compliance audit trail | Indexed on `shopId`, `action`, `createdAt` |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** `>= 22.12.0` (LTS recommended)
- **npm:** `>= 10.0.0`
- **Shopify CLI:** `@shopify/cli` (`5.0+`)
- **Shopify Partner Account** and a Development Store

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, and development tunnel URL.

### 3. Database Migration
```bash
# Generate Prisma client and apply migrations
npx prisma migrate dev --name init
```

### 4. Running the App
```bash
# Start local development with Shopify CLI (creates tunnel & sets up app bridge)
npm run dev

# Or start the local server directly
npm run build
npm run start
```

### 5. Verification Commands
```bash
# TypeScript verification
npm run typecheck

# Linting
npm run lint

# Production build verification
npm run build
```

---

## 🛡️ Development Quality & Boundaries

In accordance with Phase 0 requirements:
- No hardcoded secrets or production database credentials exist in source files.
- No deprecated Shopify packages (`@shopify/polaris` React package has been avoided in favor of modern Polaris Web Components supported by App Bridge v4).
- OpenAI live API calls, automated feed mutations, and live campaign spending are cleanly partitioned into future phases.

---

*(c) 2026 Cartlight Labs. All rights reserved.*
