# Highland Gardens Management System (HG-MS)

> Enterprise Food Production, Inventory, Batch Quality, and Omnichannel Sales Operating System for Highland Gardens.

![Highland Gardens](https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80)

## Overview

**Highland Gardens MS** is an end-to-end cloud business platform engineered specifically for growing premium food production, artisanal packaging, and agro-processing companies. It unifies omnichannel sales (Direct D2C, B2B Supermarkets, WhatsApp conversational commerce), multi-warehouse raw material inventory, batch traceability with KEBS quality control, and executive business intelligence.

---

## Key Modules & Features

### 1. Omnichannel Sales & Order Management
- **Interactive POS & Order Intake**: Direct customer order capture with custom cart calculation, packaging fees, and discounts.
- **WhatsApp Bot Simulator**: Direct conversational order parsing, converting unstructured text into structured orders with auto-calculated totals.
- **M-PESA Express STK Push Integration**: Native Daraja API STK push simulator with real-time phone number validation and instant reconciliation.
- **Order Pipeline Tracking**: Status lifecycle transitions (Pending, Processing, Quality Check, In Transit, Delivered, Cancelled) with full update & delete controls.
- **Customer CRM**: Complete customer database with purchase history, tier categorization, lifetime spend tracking, and CRUD management.

### 2. Multi-Warehouse Inventory & Production Traceability
- **Raw Material Stock Matrix**: Real-time tracking of ingredients, packaging, and supplies with minimum safety threshold alerts.
- **Batch Production Tracking**: Formulation batch logs, expiry monitoring, yields, unit cost calculations, and scrap analysis.
- **Supplier Directory**: Vendor management with lead times, rating scores, credit terms, and contact points.

### 3. KEBS Quality Control & Regulatory Compliance
- **Batch Quality Testing**: Physical, chemical, and microbiological test checklists with pass/fail verification before inventory release.
- **Compliance Vault**: Digital repository for KEBS certifications, public health permits, and organic standard renewals.
- **Complaints & CAPA Workflow**: Corrective and Preventive Action management linked directly to production batch serial numbers.

### 4. B2B Wholesale & Modern Trade Distribution
- **Retail Accounts**: Multi-branch supermarket and grocery chains management (Naivas, Carrefour, QuickMart, etc.).
- **Tiered B2B Price Books**: Volume discounts and agreed contractual rates per retailer tier.
- **Invoicing & Credit Control**: Aging balance tracking, payment receipt recording, and delivery route optimization.

### 5. Executive BI & Financial Intelligence
- **Real-Time KPIs**: Gross merchandise value, operating margins, COGS breakdown, and customer acquisition velocity.
- **Channel Profitability**: Direct comparative analytics across Retail, Wholesale, and Direct Channels.
- **Audit Logs & Export**: Full transaction audit trail with CSV/JSON exports.

---

## Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler & Tooling**: Vite 8, ESBuild
- **Styling**: Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans & Playfair Display typography
- **Animations**: Framer Motion
- **Deployment**: Vercel Serverless Platform with client-side SPA rewrites

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/versalylabs/highland-gardens-ms.git
   cd highland-gardens-ms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## License

Proprietary © Versaly Labs / Highland Gardens. All rights reserved.
