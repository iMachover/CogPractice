# Simple Bank Application - REST API

A backend REST API for a simple banking system built with Node.js, Express, and MongoDB.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Architecture:** MVC (Controllers, Services, Repositories, Models)

## Setup & Installation

1. Clone the repository and navigate to this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your MongoDB Atlas URI, Port, and a secure JWT Secret:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bankapp?retryWrites=true&w=majority
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=YourSuperSecretKey123!
   ```
   *Note: The server will refuse to start if `JWT_SECRET` is missing.*
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication (JWT)
* **Register**
  * `POST /api/auth/register`
  * Body: `{ "name": "String", "email": "String", "password": "String" }`
  * *Note: Passwords must be at least 8 characters long and contain at least one uppercase letter and one number.*
* **Login**
  * `POST /api/auth/login`
  * Body: `{ "email": "String", "password": "String" }`
  * Returns: `{ "token": "JWT_TOKEN", "user": { ... } }`

> **Note**: All routes below under **Users** and **Accounts** require a valid JWT token to be passed in the `Authorization` header as a Bearer token (`Authorization: Bearer <token>`).

### Users
* **Get All Users** *(Admin only)*
  * `GET /api/users`
* **Get User by ID**
  * `GET /api/users/:id`
* **Get User Transactions** *(Admin only)*
  * `GET /api/users/:id/transactions`
  * *Returns all transactions across all accounts for a specific user.*
* **Delete User** *(Admin only, Cascading Delete)*
  * `DELETE /api/users/:id`
  * *Deletes the user, all their accounts, and all related transactions.*

### Accounts
* **Create Account**
  * `POST /api/accounts`
  * Body: `{ "userId": "String (ObjectId)", "accountType": "SAVINGS" | "CHECKING" }`
* **Get Account Details**
  * `GET /api/accounts/:id`
* **Deposit Money**
  * `POST /api/accounts/:id/deposit`
  * Body: `{ "amount": Number }`
* **Withdraw Money**
  * `POST /api/accounts/:id/withdraw`
  * Body: `{ "amount": Number }`
* **Get Transaction History**
  * `GET /api/accounts/:id/transactions`
* **Delete Account** *(Cascading Delete)*
  * `DELETE /api/accounts/:id`
  * *Deletes the account and all related transactions.*

## Features, Security & Business Rules
- **JWT Authentication:** Secures API endpoints and encodes user roles.
- **Role-Based Access Control (RBAC):** Admin-only routes are protected via middleware.
- **Password Strength Enforcement:** Required on registration.
- **CORS Restriction:** Only allows requests from the defined `FRONTEND_URL`.
- **Error Masking:** Internal 500 errors and stack traces are logged but masked from the API response for security.
- **Cascading Deletes:** Ensures no orphaned accounts or transactions are left in the database.
- **Transaction Validation:** Withdrawals cannot exceed the current balance, and amounts must be positive.
- **Audit Trails:** A transaction record is created and stored in the database for every successful deposit or withdrawal.
