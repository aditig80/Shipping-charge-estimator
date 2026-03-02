# 🚚 E-Commerce Shipping Charge Estimator

A REST API built with **Node.js + Express** to calculate shipping charges for a B2B e-commerce marketplace that helps Kirana stores discover and order products.

---

## 📌 Problem Statement

Build APIs to calculate the shipping charge for delivering a product in a B2B e-commerce marketplace, taking into account:
- Seller location → nearest warehouse
- Warehouse → customer distance
- Transport mode based on distance
- Delivery speed (Standard / Express)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| PostgreSQL + Sequelize | Database & ORM |
| Redis | Response caching |
| Haversine Formula | Distance calculation |
| Jest + Supertest | Unit testing |

---

## 📁 Project Structure

```
shipping-estimator/
├── src/
│   ├── config/
│   │   ├── database.js         # Sequelize + PostgreSQL config
│   │   └── redis.js            # Redis client config
│   ├── models/
│   │   ├── Customer.js         # Kirana store entity
│   │   ├── Seller.js           # Seller entity
│   │   ├── Product.js          # Product entity
│   │   ├── Warehouse.js        # Warehouse entity
│   │   └── index.js            # Model associations + DB sync
│   ├── controllers/
│   │   ├── warehouseController.js
│   │   └── shippingController.js
│   ├── services/
│   │   ├── distanceService.js  # Haversine + transport mode logic
│   │   ├── warehouseService.js # Nearest warehouse logic
│   │   └── shippingService.js  # Shipping charge calculation
│   ├── routes/
│   │   ├── index.js
│   │   ├── warehouseRoutes.js
│   │   └── shippingRoutes.js
│   ├── middlewares/
│   │   └── errorHandler.js     # Global error handler
│   ├── utils/
│   │   └── AppError.js         # Custom error class
│   └── app.js                  # Express app setup
├── seeders/
│   └── seed.js                 # Sample data seeder
├── tests/
│   ├── warehouse.test.js
│   └── shipping.test.js
├── .env
├── package.json
└── server.js
```

---

## 🗃️ Entities & Data Model

### Customer (Kirana Store)
| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | Store name |
| phone | String | Contact number |
| email | String | Email address |
| address | String | Street address |
| city | String | City |
| pincode | String | PIN code |
| lat / lng | Float | GPS coordinates |
| gstNumber | String | GST for B2B |
| businessType | String | e.g., Kirana, Wholesale |

### Seller
| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | Seller name |
| lat / lng | Float | Seller's GPS location |
| city | String | City |
| rating | Float | Seller rating (0–5) |

### Product
| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | Product name |
| sellingPrice | Float | Price in Rs |
| weightKg | Float | Weight in KG (used for shipping) |
| dimLength/Width/Height | Float | Dimensions in cm |
| category | String | e.g., Grocery, Grains |
| sellerId | FK | Belongs to a Seller |

### Warehouse
| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | Warehouse name |
| lat / lng | Float | GPS coordinates |
| city | String | City |
| capacity | Integer | Max stock units |
| isActive | Boolean | Active status |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Redis

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd shipping-estimator
npm install
```

### 2. Configure Environment
Create a `.env` file in the root:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shipping_db
DB_USER=postgres
DB_PASSWORD=yourpassword
REDIS_URL=redis://localhost:6379
```

### 3. Create the Database
```bash
psql -U postgres
CREATE DATABASE shipping_db;
\q
```

### 4. Seed Sample Data
```bash
node seeders/seed.js
```
This creates:
- 2 Warehouses (Bangalore, Mumbai)
- 3 Sellers (Chennai, Delhi, Mumbai)
- 3 Products (Maggie, Rice Bag, Sugar Bag)
- 2 Customers (Kirana stores)

### 5. Start the Server
```bash
npm run dev
```
Server runs at: `http://localhost:3000`

---

## 📡 API Reference

### 1. Get Nearest Warehouse for a Seller

```
GET /api/v1/warehouse/nearest?sellerId=1&productId=1
```

**Response:**
```json
{
  "warehouseId": 1,
  "warehouseName": "BLR_Warehouse",
  "warehouseLocation": { "lat": 12.99999, "lng": 37.923273 },
  "distanceFromSellerKm": 245.67
}
```

---

### 2. Get Shipping Charge from Warehouse to Customer

```
GET /api/v1/shipping-charge?warehouseId=1&customerId=1&deliverySpeed=standard
```

**Query Params:**
| Param | Required | Values |
|---|---|---|
| warehouseId | Yes | Warehouse ID |
| customerId | Yes | Customer ID |
| deliverySpeed | Yes | `standard` or `express` |

**Response:**
```json
{
  "shippingCharge": 150.00
}
```

---

### 3. Full Shipping Calculation (Seller → Warehouse → Customer)

```
POST /api/v1/shipping-charge/calculate
```

**Request Body:**
```json
{
  "sellerId": 1,
  "customerId": 1,
  "productId": 1,
  "deliverySpeed": "express"
}
```

**Response:**
```json
{
  "shippingCharge": 180.00,
  "nearestWarehouse": {
    "warehouseId": 1,
    "warehouseName": "BLR_Warehouse",
    "warehouseLocation": { "lat": 12.99999, "lng": 37.923273 }
  },
  "details": {
    "distanceKm": 432.5,
    "transportMode": "Truck",
    "baseCharge": 168.00,
    "deliverySpeed": "express"
  }
}
```

---

## 💰 Shipping Charge Logic

### Transport Mode (based on distance)
| Mode | Distance | Rate |
|---|---|---|
| Aeroplane | 500 km+ | Rs 1 per km per kg |
| Truck | 100–499 km | Rs 2 per km per kg |
| Mini Van | 0–99 km | Rs 3 per km per kg |

### Delivery Speed
| Speed | Formula |
|---|---|
| Standard | Rs 10 (flat) + base charge |
| Express | Rs 10 (flat) + Rs 1.2/kg + base charge |

### Base Charge Formula
```
Base Charge = Distance (km) × Weight (kg) × Rate (Rs/km/kg)
```

---

## ⚠️ Error Handling

All errors return a consistent JSON format:

```json
{ "error": "Descriptive error message" }
```

| Status | Scenario |
|---|---|
| 400 | Missing or invalid parameters |
| 404 | Seller / Customer / Warehouse / Product not found |
| 500 | Unexpected server error |

---

## 🏗️ Design Patterns Used

### Strategy Pattern — Delivery Speed
Each delivery speed (`standard`, `express`) is a separate strategy object. Adding a new speed (e.g., `same-day`) requires only adding a new entry — no existing code changes.

```javascript
const deliverySpeedStrategies = {
  standard: (baseCharge) => 10 + baseCharge,
  express: (baseCharge, weightKg) => 10 + (1.2 * weightKg) + baseCharge,
};
```

### Repository Pattern — Services
All database access is abstracted into service files, keeping controllers thin and focused on request/response handling only.

### Middleware Pattern — Error Handling
A single global `errorHandler` middleware catches all errors and returns consistent responses, avoiding repetitive try/catch in every controller.

---

## ⚡ Caching

Redis caching is applied on:
- **Nearest Warehouse** — cached for 10 minutes (warehouse locations rarely change)
- **Shipping Charge** — cached for 5 minutes per warehouse+customer+speed combination

Cached responses include `"fromCache": true` in the response body.

---

## 🧪 Running Tests

```bash
npm test
```

Tests cover:
- Missing / invalid query parameters → 400
- Non-existent seller / customer / warehouse → 404
- Valid requests returning correct structure
- Edge case: no active warehouses available

---

## 📦 Sample Seed Data

| Entity | Name | Location |
|---|---|---|
| Warehouse | BLR_Warehouse | Bangalore |
| Warehouse | MUMB_Warehouse | Mumbai |
| Seller | Nestle Seller | Chennai |
| Seller | Rice Seller | Delhi |
| Seller | Sugar Seller | Mumbai |
| Customer | Shree Kirana Store | Coimbatore |
| Customer | Andheri Mini Mart | Hyderabad |

---

## 📝 Scripts

```bash
npm run dev      # Start server with hot reload (nodemon)
npm start        # Start server normally
npm test         # Run unit tests
node seeders/seed.js  # Seed the database
```
