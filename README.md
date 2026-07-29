# National Bank App - Frontend

A modern, professional web interface for the National Bank application, built with React and Vite. This frontend application integrates with the pre-existing Node/Express backend to provide users with secure and reliable access to their banking services and customer management.

## Features

- **Professional UI/UX:** A clean, crisp, and high-trust corporate design using vanilla CSS.
- **Routing:** Client-side navigation handled by React Router (`react-router-dom`).
- **Secure Authentication:** JWT-based secure login integration with the backend.
- **Customer Management (CRUD):** 
  - View all registered customers.
  - Create new customer profiles.
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

## Project Structure

```
src/
├── components/       # Reusable layout components
│   ├── Header.jsx    # Main navigation bar
│   ├── Footer.jsx    # Page footer
│   └── Layout.jsx    # Global page wrapper
├── pages/            # Route components
│   ├── Home.jsx      # Landing page
│   ├── About.jsx     # About Us information
│   ├── Contact.jsx   # Contact details
│   └── Services.jsx  # Protected customer CRUD operations
├── App.jsx           # Main application routing
├── main.jsx          # React entry point
└── index.css         # Global professional design system styles
```
