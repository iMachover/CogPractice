# Bank Console API

A simple Express Node.js backend for the bank console app.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the API server:
   ```bash
   npm start
   ```
   *The server will run on http://localhost:3000*

## API Routes

**Base URL:** `http://localhost:3000`

| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/health` | API status health check |
| GET | `/api/v1/customers` | Get a list of all customers and their data |
| GET | `/api/v1/customers/:username` | Get account details for a specific customer |

## Data Model

**Customer**
```json
{
  "username": "string",
  "checkingBalance": "number",
  "savingsBalance": "number",
  "transactions": ["string"]
}
```

## Tech Stack
- **Node.js**
- **Express** (JavaScript, no TypeScript compilation needed)
