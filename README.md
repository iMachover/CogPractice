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
3. Create a `.env` file in the root directory and add your MongoDB Atlas URI:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bankapp?retryWrites=true&w=majority
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Users (Helper Routes)
* **Create User**
  * `POST /api/users`
  * Body: `{ "name": "String", "email": "String" }`
* **Get All Users**
  * `GET /api/users`
* **Get User by ID**
  * `GET /api/users/:id`

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

## Features & Business Rules
- Withdrawal amounts cannot exceed the current account balance.
- Deposits and withdrawals must be positive numbers.
- A transaction record is created and stored in the database for every successful deposit or withdrawal.
