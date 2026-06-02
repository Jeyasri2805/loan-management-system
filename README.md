# LoanPro — Loan Application & Verification System

A modern, full-stack mini-project for a 6th-semester college submission.
Users can sign up, apply for loans, track EMIs, and view their dashboard.
Admins can approve/reject applications, search/filter, and view analytics.

---

## Tech Stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| Frontend    | React.js (Vite), Tailwind CSS, React Router, Axios, Chart.js, react-hot-toast |
| Backend     | Django, Django REST Framework, SimpleJWT (JWT auth), CORS Headers |
| Database    | SQLite (default Django DB)                              |
| Auth        | JWT token-based, role-based (`user` / `admin`)          |

---

## Project Structure

```
pride project/
├── backend/                # Django REST API
│   ├── loanapp/            # Project settings, root URL config
│   ├── accounts/           # Custom User model + auth endpoints (JWT)
│   ├── loans/              # Loan model, serializers, user/admin views
│   ├── manage.py
│   └── requirements.txt
└── frontend/               # React + Vite + Tailwind UI
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/     # Navbar, StatCard, EMI Calculator, ProtectedRoute…
    │   └── pages/          # Landing, Login, Signup, Dashboards, Forms…
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Features

### Authentication
- Separate **User** and **Admin** login pages (split-screen UI)
- User signup with full validation (email, phone, password match)
- JWT access & refresh tokens
- Session persistence in `localStorage`
- Protected routes with role-based redirects

### User Side
- **Welcome dashboard** with stats cards, pie chart (loan status), bar chart (EMI/payments)
- **EMI calculator** (live)
- **Loan application form** — multi-section, dropdowns, full validation:
  - Personal details (name, email, phone, DOB, gender)
  - Identity (Aadhaar, PAN with regex validation)
  - Employment & loan type dropdowns
  - Loan amount, tenure (6mo / 1y / 2y / 5y), monthly income
  - Address (city, state, pincode)
  - Purpose of loan textarea
- **My Loans** — track each loan with progress bar, EMI payment button
- Loan tracking shows: amount, interest %, total, paid, remaining, EMI, due date, status

### Admin Side
- Dedicated admin dashboard with stat cards
- **Pie + Bar charts** for loan status & loan-type distribution
- **All applications** list with **search, filter by status/loan type**
- **Approve / Reject** with one click
- Detailed applicant view with full info & EMI breakdown

### Validations (frontend + backend)
- Aadhaar — 12 digits
- PAN — `[A-Z]{5}[0-9]{4}[A-Z]`
- Phone — 10-digit Indian format starting with 6-9
- Pincode — 6 digits
- Loan amount > 0, ≤ 1 Crore
- Password length & match
- Toast notifications for every action

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations accounts loans
python manage.py migrate
python manage.py seed_admin            # creates default admin
python manage.py runserver
```

Backend runs on **http://127.0.0.1:8000/**

**Default admin credentials**
```
Email:    admin@loanapp.com
Password: admin123
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173/**

> Make sure both servers are running together.

---

## API Reference

Base URL: `http://127.0.0.1:8000/api`

### Auth
| Method | Endpoint                | Body                                     | Auth | Description           |
| ------ | ----------------------- | ---------------------------------------- | ---- | --------------------- |
| POST   | `/auth/signup/`         | full_name, email, phone, password, confirm_password | ❌ | Register new user      |
| POST   | `/auth/login/`          | email, password                          | ❌  | User login             |
| POST   | `/auth/admin-login/`    | email, password                          | ❌  | Admin login            |
| GET    | `/auth/me/`             | —                                        | ✅  | Current profile        |

### Loans (User)
| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| GET    | `/loans/`                 | List my loan applications         |
| POST   | `/loans/`                 | Submit new loan application       |
| GET    | `/loans/<id>/`            | Single loan detail                |
| GET    | `/loans/stats/`           | Dashboard stats                   |
| POST   | `/loans/<id>/pay/`        | Record EMI payment (`amount`)     |

### Loans (Admin)
| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| GET    | `/loans/admin/all/?search=&status=&loan_type=` | All applications + filters     |
| GET    | `/loans/admin/stats/`             | Admin analytics                |
| GET    | `/loans/admin/<id>/`              | Application detail             |
| PATCH  | `/loans/admin/<id>/status/`       | Update status (Approved/Rejected) |

All authenticated endpoints expect `Authorization: Bearer <access_token>`.

---

## Demo Walkthrough

1. Open http://localhost:5173 → choose **Login as User** or **Login as Admin**
2. **As a User:**
   - Sign up → land on the Dashboard
   - Click **Apply Loan** → fill the multi-section form → Submit
   - Visit **My Loans** to track your applications
   - Use the **EMI Calculator** on the dashboard
3. **As an Admin** (`admin@loanapp.com / admin123`):
   - View all applications, filter & search
   - Approve / Reject pending loans
   - Open a single application for full details + EMI summary

---

## Why this structure works for a college mini project
- **Modular** — each Django app handles one concern (`accounts`, `loans`)
- **Beginner-friendly** — no advanced patterns (one settings file, simple folder layout)
- **Easy to explain** — clear separation of frontend/backend, predictable routes
- **Visually impressive** — soft palette, dashboard cards, charts, gradient accents
- **Fully responsive** — Tailwind-based responsive design

Happy submitting!
