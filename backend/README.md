# BatteryAdvisor.be — Strapi v5 Backend

CMS backend for [BatteryAdvisor.be](https://batteryadvisor.be), a French-language independent advisory site for plug-in home batteries in Belgium.

## Prerequisites

- Node.js 18–22
- npm 6+

## Setup

```bash
# Install dependencies
npm install

# Copy environment file and fill in your secrets
cp .env.example .env
# Generate secrets:
#   openssl rand -base64 32   (repeat for each key)

# Start in development mode
npm run develop
```

The admin panel opens at `http://localhost:1337/admin`.  
On first launch, create your admin account.

## Content Types

| Name                  | Kind         | API ID                                             |
|-----------------------|--------------|-----------------------------------------------------|
| Battery               | Collection   | `api::battery.battery`                              |
| Brand                 | Collection   | `api::brand.brand`                                  |
| Article               | Collection   | `api::article.article`                              |
| Category              | Collection   | `api::category.category`                            |
| Scoring Methodology   | Single       | `api::scoring-methodology.scoring-methodology`      |

### Relations

- **Battery** → many-to-one → **Brand** (a brand has many batteries)
- **Article** → many-to-one → **Category** (a category has many articles)

## API Endpoints (REST)

Once permissions are set in the admin panel:

```
GET /api/batteries
GET /api/batteries/:id
GET /api/brands
GET /api/articles
GET /api/categories
GET /api/scoring-methodology
```

Strapi v5 uses a flat response format by default (no nested `data.attributes`).

## Build for Production

```bash
npm run build
npm run start
```
