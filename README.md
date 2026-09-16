# STRIDE Footwear - Mobile-First Shoe E-Commerce Store with RAG AI Chatbot

A production-quality, mobile-first footwear e-commerce application built with Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma ORM with PostgreSQL and `pgvector`, and a RAG (Retrieval-Augmented Generation) AI shopping concierge.

---

## 🌟 Key Features

### 1. Modern Mobile-First Shopping Experience
- **Responsive Architecture**: Handcrafted breakpoints for 320px, 375px, 390px, 414px mobile screens up to 4K desktop monitors.
- **Mobile Navigation Drawer**: Smooth slide-over navigation with category links, search shortcuts, and direct AI assistant triggers.
- **Product Catalog**: 16 realistic, diverse footwear models (Marathon running with carbon propulsion, court basketball, waterproof mountain trail, Italian nappa leather lifestyle, recovery slides, and kids runners).
- **Faceted Product Filtering**:
  - Full-text search across titles, descriptions, and materials
  - Multi-category filter (Running, Lifestyle, Trail, Basketball, Training, Luxury)
  - Gender filter (Men, Women, Unisex, Kids)
  - Price range presets ($0-$100, $100-$150, $150-$200, $200+)
  - US Size selector chips (6 through 13)
  - Brand filter (Stride, Velo Studio, Apex Outdoor, Volt Athletic, Aura Luxe)
  - Customer rating threshold (4.7+ ★, 4.8+ ★)
  - Sorting (Featured, Newest drops, Price low-to-high, Price high-to-low, Highest rated)
  - Mobile bottom-sheet filter drawer
- **Product Detail Page**:
  - Multi-angle high-resolution gallery with thumbnail switcher
  - Real-time colorway swatches & US size selector
  - Stock indicator & quantity controls
  - Dynamic tabs: Features & Highlights, Technical Specifications, Shipping & 30-Day Wear Trial
  - Direct "Ask AI about this shoe" shortcut button
- **Cart & Slide-Over Drawer**:
  - Reactive cart state with `localStorage` persistence
  - Animated Free Express Shipping progress bar ($75 threshold)
  - Quantity steppers & instant remove
- **Guest Checkout Flow**:
  - Shipping address form
  - Delivery speed selector (Standard Free $75+, Expedited 2-Day, Overnight)
  - Payment method selector (Credit card simulation, Apple Pay, PayPal)
  - Promo code engine (`STRIDE10` for 10% off)
  - Order confirmation screen with generated order ID and summary

---

### 2. RAG (Retrieval-Augmented Generation) AI Shopping Assistant
- **Real Knowledge Retrieval**: Grounded in store policies (30-day outdoor wear test trial, free shipping over $75, warranty, care guides) and shoe specifications (supercritical nitrogen foam, carbon propulsion plate, Vibram Megagrip, GORE-TEX).
- **Vector Similarity Search**:
  - PostgreSQL + `pgvector` support: queries cosine distance `<=>` via Prisma.
  - Resilient In-Memory Fallback: 1536-dimensional normalized cosine similarity engine for immediate zero-config standalone execution.
- **Interactive Chat Product Cards**:
  - Assistant automatically identifies matching shoes and attaches clickable mini-cards right in the chat message bubble.
  - Allows customers to click "Add to Bag" or "View Details" directly from the conversation!
- **Dynamic Suggested Questions**: Contextually relevant follow-up prompt chips.
- **Multi-Provider LLM Abstraction**:
  - OpenAI (`OPENAI_API_KEY`, `LLM_MODEL="gpt-4o-mini"`, `EMBEDDING_MODEL="text-embedding-3-small"`)
  - Google Gemini (`GEMINI_API_KEY`, `GEMINI_MODEL="gemini-1.5-flash"`, `GEMINI_EMBEDDING_MODEL="text-embedding-004"`)
  - Built-in Neural RAG Synthesis Engine: Operates seamlessly even without an external API key.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Database**: PostgreSQL with `pgvector` extension
- **ORM**: Prisma Client v6
- **State Management**: React Context API with LocalStorage synchronization

---

## 🚀 Getting Started

### 1. Installation

```bash
cd C:\Users\HP\.gemini\antigravity\scratch\solecraft
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Optional: PostgreSQL + pgvector (Leave commented to use the built-in resilient vector store)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solecraft?schema=public"

# AI Provider Configuration (OpenAI or Gemini)
AI_PROVIDER="openai"
OPENAI_API_KEY="your_openai_api_key_here"
LLM_MODEL="gpt-4o-mini"
EMBEDDING_MODEL="text-embedding-3-small"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Running the App

```bash
# Start development server
npm run dev

# Or build and start production server
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database & pgvector Integration

When you connect a live PostgreSQL database with pgvector:

1. Add your connection string to `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/solecraft?schema=public"
   ```
2. Run Prisma migration:
   ```bash
   npx prisma db push
   ```
3. Seed products and knowledge documents:
   ```bash
   # Via npm script
   npm run seed

   # Or trigger via the REST API endpoint:
   curl -X POST http://localhost:3000/api/seed
   ```

---

## 📂 Project Structure

```
solecraft/
├── prisma/
│   ├── schema.prisma           # Prisma schema with pgvector vector(1536)
│   └── seed.ts                 # Database seeder
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with CartProvider & ClientShell
│   │   ├── globals.css         # Tailwind directives & styles
│   │   ├── page.tsx            # Home page (Hero, Categories, Arrivals, RAG CTA)
│   │   ├── shop/
│   │   │   └── page.tsx        # Responsive Shop & Filter page
│   │   ├── product/[id]/
│   │   │   └── page.tsx        # Product detail page with gallery & size selector
│   │   ├── cart/
│   │   │   └── page.tsx        # Dedicated Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx        # Guest checkout & confirmation
│   │   └── api/
│   │       ├── chat/route.ts   # RAG AI assistant endpoint
│   │       ├── products/route.ts # Search & filter endpoint
│   │       └── seed/route.ts   # Seed & health check endpoint
│   ├── components/
│   │   ├── navbar.tsx          # Responsive navbar with mobile drawer
│   │   ├── footer.tsx          # Store footer & value props
│   │   ├── product-card.tsx    # Card with badges, hover swap, quick add
│   │   ├── product-grid.tsx    # Responsive grid (2-col mobile, 3/4-col desktop)
│   │   ├── filter-sidebar.tsx  # Desktop sidebar & mobile filter sheet
│   │   ├── cart-drawer.tsx     # Slide-over cart with free shipping bar
│   │   ├── quick-view-modal.tsx# Fast product preview modal
│   │   └── ai-chat/
│   │       ├── chat-widget.tsx # Floating trigger, desktop dialog, mobile bottom-sheet
│   │       └── chat-product-card.tsx # Embedded interactive shoe card
│   └── lib/
│       ├── db.ts               # Prisma singleton
│       ├── cart-context.tsx    # Cart state & calculations
│       ├── products-data.ts    # 16 shoe models with specs & imagery
│       ├── knowledge-base.ts   # Store policies, sizing guide & FAQ
│       └── ai/
│           ├── embeddings.ts   # Vector embedding generator
│           ├── vector-store.ts # pgvector query & cosine similarity
│           ├── llm-provider.ts # OpenAI / Gemini / fallback abstraction
│           └── rag-service.ts  # End-to-end RAG orchestrator
├── package.json
└── tsconfig.json
```
