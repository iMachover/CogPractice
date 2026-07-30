# National Bank App - Frontend

A modern, professional web interface for the National Bank application, built with React and Vite. This frontend application integrates with the pre-existing Node/Express backend to provide users with secure and reliable access to their banking services and customer management.

## Features

- **Professional UI/UX:** A clean, crisp, and high-trust corporate design using vanilla CSS.
- **Routing:** Client-side navigation handled by React Router (`react-router-dom`).
- **Secure Authentication:** JWT-based secure login integration with the backend.
- **Role-Based Dashboards:** 
  - **Admin Dashboard:** Manage customers, register new accounts, and view full transaction audit histories.
  - **Customer Dashboard:** Open checking/savings accounts, perform deposits/withdrawals, and view account-level transaction history.
- **Customer Management (CRUD):** 
  - View all registered customers.
  - Create new customer profiles (with strong password enforcement).
  - Securely delete existing customers.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS (Custom Design System)

## Prerequisites

Before you begin, ensure you have the backend running. The backend API should be accessible at `http://localhost:3000`.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the port specified by Vite in your terminal).

3. **Build for Production:**
   ```bash
   npm run build
   ```
   This will generate a `dist` directory with the optimized production files.

## Testing with Admin Account

To test admin-only features (such as viewing all customers or managing accounts), you can use the following credentials:
- **Email/Username:** `admin@test.com`
- **Password:** `Admin123`

*Note: Normally, to create an admin account, you would need to create a new user account through the application and then manually change their role permission directly in the MongoDB database. To simplify testing, these admin account credentials are provided.*

## Project Structure

```
src/
├── components/       # Reusable layout components
│   ├── Header.jsx    # Main navigation bar
│   ├── Footer.jsx    # Page footer
│   └── Layout.jsx    # Global page wrapper
├── pages/            # Route components
│   ├── Home.jsx      # Landing page with smart CTA routing
│   ├── About.jsx     # About Us information
│   ├── Contact.jsx   # Contact details
│   └── Services.jsx  # Authentication, Dashboards, and Transactions
├── App.jsx           # Main application routing
├── main.jsx          # React entry point
└── index.css         # Global professional design system styles
```
