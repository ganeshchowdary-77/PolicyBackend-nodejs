# 🛡️ Policy Service API

> A robust, microservice-ready backend for managing insurance policies. Built with **Node.js**, **Express**, and **MongoDB**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v18%2B-green)
![Database](https://img.shields.io/badge/MongoDB-Atlas-forestgreen)

## 📖 Overview

The **Policy Service** is a dedicated backend microservice designed to handle the lifecycle of insurance policies. It decouples business logic from database IDs by using unique **Policy Codes** (e.g., `LIF001`, `VEH003`) as the primary identifier. This ensures seamless integration with other services (like Claims or Billing) and provides a clean, user-friendly API for frontend applications.

### 🌟 Key Features
* **Business-Key Logic:** Uses readable `Policy Codes` (e.g., `HLT005`) instead of internal Database IDs for all operations.
* **Role-Based Endpoints:** Distinct routes for **Public** (Consumption) and **Admin** (Management).
* **Soft Delete:** "Deactivate" policies without losing historical data using the toggle feature.
* **Smart Analytics:** Built-in aggregation for real-time policy statistics.
* **Robust Validation:** Ensures data integrity (e.g., preventing negative premiums).

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v14 or higher)
* MongoDB Connection String (Atlas or Local)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/policy-service.git](https://github.com/your-username/policy-service.git)
    cd policy-service
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/policyDB
    NODE_ENV=development
    ```

4.  **Run the Server**
    ```bash
    npm start
    ```
    *Server will start at `http://localhost:3000`*

---

## 🔌 API Documentation

### 🟢 Public / Service Layer
*Read-only endpoints designed for Frontend UIs and external Microservices.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | **/api/policies** | List all **Active** policies only. |
| `GET` | **/api/policies/:code** | Get details of a specific policy by code (e.g., `/api/policies/LIF001`). |

### 🔴 Admin / Management Layer
*Write-access endpoints for Back-office operations.*

| Method | Endpoint | Description | Request Body (Example) |
| :--- | :--- | :--- | :--- |
| `GET` | **/api/policies/admin/stats** | View aggregation stats (Total active, revenue, etc). | *None* |
| `POST` | **/api/policies/admin/create** | Create a new policy. | `{ "policyCode": "LIF001", "policyName": "Family Cover", ... }` |
| `PUT` | **/api/policies/admin/:code** | Update an existing policy. | `{ "premiumAmount": 1200 }` |
| `PATCH` | **/api/policies/admin/:code/toggle** | **Soft Delete**: Toggle a policy between Active/Inactive. | *None* |
| `DELETE` | **/api/policies/admin/:code** | **Hard Delete**: Permanently remove a policy. | *None* |

---

## 📦 Data Model

The `Policy` object is the core entity of this service.

```json
{
  "policyCode": "LIF001",       // Unique Business Key
  "policyName": "Premium Life",
  "policyType": "Life",         // Enum: Life, Health, Vehicle, Property
  "policyCategory": "Individual", // Enum: Individual, Corporate, Family
  "coverageAmount": 500000,
  "premiumAmount": 1200,
  "premiumFrequency": "Yearly", // Enum: Monthly, Quarterly, Yearly
  "durationYears": 20,
  "maxClaimAmount": 500000,
  "waitingPeriodDays": 30,
  "renewable": true,
  "gracePeriodDays": 30,
  "isActive": true              // Soft Delete Flag
}